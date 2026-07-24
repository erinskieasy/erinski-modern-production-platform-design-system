# Login Authentication Wiring

This guide documents the production authentication contract behind the approved login component. The CSS and markup remain portable; the Atlas endpoint names below are the reference implementation for future integrations.

## Required Behavior

Use Google Identity Services with FedCM as the first sign-in attempt when an anonymous user reaches a protected login surface without a saved account hint. Set `use_fedcm_for_prompt: true`, pass a fresh server-issued nonce, and keep `auto_select: false`.

Chrome may offer an approved Google profile through its own browser-controlled prompt. That prompt cannot be styled, copied, overlaid, or disguised as the custom `.ds-login__account` card. See [Google's FedCM migration guidance](https://developers.google.com/identity/gsi/web/guides/fedcm-migration).

FedCM is an enhancement, not the only route. A dismissed prompt, unavailable Google Identity Services script, blocked third-party sign-in, or an unsupported browser must leave the normal OAuth actions usable.

## Frontend Flow

1. Fetch the current app session and the optional last-account hint.
2. If a valid session exists, render the authenticated application.
3. If logged out and a hint exists, render the real `.ds-login__account` card with the returned name, email, and avatar. The hint is display and routing metadata, never a credential.
4. If logged out and no hint exists, request a Google credential configuration from the server, initialize Google Identity Services with its client ID and nonce, and call the FedCM-enabled prompt.
5. POST any returned Google credential to the server. Never decode it in the browser and treat the result as authenticated.
6. If FedCM does not complete, retain the visible OAuth actions.

The approved account card behavior is:

- Clicking the saved account card starts OAuth with `intent=continue`. The server resolves the signed hint and sends its email to Google as `login_hint` without forcing an account chooser.
- **Log in to another account** starts OAuth without the saved hint and sends `prompt=select_account`.
- **Create account** may use the same chooser route; Google owns whether the selected identity is new or existing.
- Clearing the account card deletes the hint cookie and removes the card from the UI. It does not revoke Google access or delete the Atlas user. Implement this as a separate `.ds-login__clear` button beside `.ds-login__account` inside `.ds-login__account-wrap`; never nest one button inside the other or use a decorative SVG as the interactive control.

See [Google's OAuth web-server parameters](https://developers.google.com/identity/protocols/oauth2/web-server) for `login_hint`, `prompt`, state, nonce, and callback behavior.

## Reference Endpoints

The Atlas Vercel Functions are:

- `GET /api/auth/me`: resolve the signed Atlas session.
- `GET /api/auth/account-hint`: return only the hinted account's display fields: email, full name, and avatar URL.
- `DELETE /api/auth/account-hint`: expire the last-account hint.
- `GET /api/auth/google/config`: issue a fresh credential nonce in a signed HttpOnly cookie and return the Google client ID plus raw nonce to the browser.
- `POST /api/auth/google/credential`: verify a FedCM/GIS ID credential and create the Atlas session.
- `GET /api/auth/google/start?intent=continue`: begin OAuth with the signed hinted account's email as `login_hint`.
- `GET /api/auth/google/start?intent=another`: begin OAuth with `prompt=select_account`.
- `GET /api/auth/google/callback`: verify state, exchange the authorization code, verify the returned ID token, synchronize the user, create cookies, and redirect to the app.
- `POST /api/auth/logout`: expire the session while retaining the last-account hint for the approved logged-out card.

Keep authentication and Google token verification in serverless functions. The design-system component must not own secrets, token validation, database writes, or session creation.

## Credential Verification

The credential endpoint and OAuth callback must apply the same server-side ID-token checks before creating a session:

1. Parse the JWT header and payload safely.
2. Fetch Google's current JWKS and select the key matching the token `kid`.
3. Verify the RSA SHA-256 signature.
4. Accept only Google's documented issuer values.
5. Require `aud` to equal `GOOGLE_CLIENT_ID`.
6. Reject expired tokens.
7. Require a stable Google subject identifier.
8. Require the token nonce to match the unexpired, server-issued nonce for this login attempt.
9. Require a present and verified email address.

Do not create a session from client-provided profile fields. Name and avatar must come from the verified token claims.

## User And Session Handling

After successful verification, call the existing `upsertGoogleUser` path:

- Match existing users by `google_sub`.
- Refresh email, full name, avatar, and last-login time.
- Insert new Google users with `is_admin: false`.
- Preserve existing authorization fields such as `is_admin` during subsequent logins.

This integration uses the application's existing `users` table and signed session cookie. It does not require Supabase Auth or an authentication schema change.

Create both of these cookies only after successful server-side verification:

- Session cookie: signed, HttpOnly, `SameSite=Lax`, secure in production, and currently valid for 7 days.
- Last-account hint: signed, HttpOnly, `SameSite=Lax`, secure in production, and currently valid for 180 days. Its payload contains only an internal user ID and expiry; the server resolves current display data from the database.

The FedCM credential nonce and OAuth state/nonce cookies are signed, HttpOnly, secure in production, and currently expire after 10 minutes. Clear one-time cookies after a successful exchange.

## OAuth Fallback Security

For the authorization-code fallback:

- Generate cryptographically random state and nonce values on the server.
- Store them in a short-lived signed HttpOnly cookie.
- Require the callback state to match before exchanging the code.
- Use the exact registered callback URL: `${APP_BASE_URL}/api/auth/google/callback`.
- Verify the exchanged ID token with the same signature, audience, expiry, nonce, subject, and verified-email rules used by the credential endpoint.
- Clear the OAuth state cookie on success and handled cancellation.

Never use `login_hint` as proof of identity. It only suggests an account to Google; the returned token still requires complete verification.

## Production Configuration

Configure these values in the Vercel production environment:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SESSION_SECRET=
APP_BASE_URL=https://your-production-host.example
```

`AUTH_SESSION_SECRET` must be a strong private value shared by the serverless functions. Do not expose it or `GOOGLE_CLIENT_SECRET` to browser code. Register the production callback URL in the matching Google OAuth client.

## Failure And Loading States

- Keep the approved login layout stable while session, hint, GIS, or OAuth work is pending.
- Disable duplicate login actions while a credential exchange is active.
- If the FedCM prompt fails or is dismissed, do not show a false authentication error; keep the normal OAuth buttons available.
- If credential verification fails, return to the logged-out login surface and allow a fresh attempt with a new nonce.
- Treat a missing or expired hint as no hint, not as an authentication failure.
- Use generic user-facing errors while recording the server verification phase for operational debugging.

## Invariants Future Agents Must Preserve

- Browser-controlled FedCM UI and the design-system account card are separate surfaces.
- A last-account hint is never a session or credential.
- Google ID tokens are trusted only after complete server-side verification.
- Nonces and OAuth state are single-login, short-lived, and server-issued.
- OAuth fallback remains available whenever FedCM is unavailable or incomplete.
- Existing Atlas user upsert and authorization behavior remains the source of truth.
- No Supabase Auth dependency or schema change is needed for this login component.

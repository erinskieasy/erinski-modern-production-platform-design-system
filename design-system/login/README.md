# Approved Login Component

Use `login.css` for the approved account-selection login screen. The component owns its complete layout and visual contract; consuming pages should not redefine its width, spacing, typography, provider tiles, account card, action buttons, or legal links.

## Contract

- Form width: `320px`, capped to the viewport with `24px` side insets.
- Page minimum height: `560px`; the form is centered with a `-12px` vertical offset.
- Provider tiles: `64px` square, `8px` radius, subtle border, static shadow.
- Provider relationship: Google G on the left, three-dot connector, canonical site icon on the right.
- Site icon: `assets/site-icon.svg` using `.ds-site-icon--auth`; the same asset must be the favicon and top-bar site mark.
- Account action: `64px` minimum height, `8px` radius, static shadow.
- Clear-account action: a separate icon button positioned by `.ds-login__account-wrap`; never nest it inside `.ds-login__account`.
- Secondary actions: approved `.ds-pill-button` primitive with `14px` separation.
- Every light clickable uses `--ds-color-clickable-hover-bg`.

## Required Head Markup

```html
<link rel="icon" type="image/svg+xml" href="assets/site-icon.svg">
<link rel="stylesheet" href="design-system/login/login.css">
```

## Structure

Use `.ds-login-page` on the containing view and `.ds-login` on the form shell. Child classes follow the `ds-login__*` names defined in `login.css`. Wrap `.ds-login__account` and its sibling `.ds-login__clear` button in `.ds-login__account-wrap`; this preserves valid button semantics and anchors the clear action to the account card. Keep the two pill buttons inside `.ds-login__actions` so the approved `14px` spacing is preserved.

Use `login.example.html` as the canonical complete markup reference.

## Authentication Integration

See `AUTH_WIRING.md` for the production Google Identity Services, FedCM, OAuth fallback, account-hint, token-verification, session-cookie, and Vercel Function contract behind this component.

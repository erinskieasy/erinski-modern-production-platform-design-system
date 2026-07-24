# Aligned Side Menu Design System

This package captures the side panel menu language from the aligned static dashboard. It is meant to be portable: map an app's existing navigation data into these classes and the menu should inherit the same width, rhythm, typography, pinned regions, hover states, and submenu behavior.

## Files

- `side-menu.tokens.css`: source-of-truth design tokens.
- `side-menu.css`: component CSS. It imports the token file.
- `side-menu.behavior.js`: small progressive-enhancement script for expandable submenus.
- `side-menu.example.html`: canonical static markup.

For full-system use, import `../aligned.css`. The side-menu tokens reference the shared foundation tokens for color, type, rhythm, icon geometry, radius, and motion.

## Layout Rules

- The panel width is `16.25rem`, equivalent to `260px` at a 16px root.
- The top identity area is fixed inside the panel at `58px` tall.
- The middle nav area is the only internally scrolling region.
- Any command/search control that should move with the menu belongs inside the middle nav scroll region.
- The bottom account/settings management area is pinned and does not scroll with the nav.
- The divider above the bottom account/settings area is the hard overflow boundary for the scrollable nav.
- Nav content must clip at that divider and must never paint underneath account/settings actions.
- Do not offset the entire scroll container with transforms if that moves its visual clipping edge below the footer divider; use padding, inset, or internal spacing instead.
- The account/settings footer must have an opaque surface and sit above the scrollable nav layer.
- If the app has a global bottom bar, set `--ds-side-viewport-footer-offset` to that bar's height. The aligned value is `48px`.

## Menu Rhythm

- Row height: `32px`.
- Row step: `36px`.
- Row gap: `4px`.
- Main row left edge: `32px`.
- Main row right edge: `14px` from the panel edge.
- Submenu text column starts at `54px` from the panel edge.
- Submenu hover band starts at `42px`, with `12px` left padding.

## Icon Geometry

- Menu icon size is exactly `17px` by `17px`.
- Menu icon top offset is exactly `7.5px` inside a `32px` row.
- Menu icon stroke width is `1.35`.
- The label starts `22px` from the menu row's left edge.
- The icon-to-label gap is exactly `5px`: `17px` icon width plus `5px` gap equals the `22px` label start.
- Do not leave icon size, stroke, top offset, or icon-to-label spacing to implementation interpretation.

## Typography

- Font family: `"Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Menu font size: `14px`.
- Main menu weight: `500`.
- Submenu weight: `500`.
- Divider label weight: `490`.
- Brand label remains separate: `13px`, weight `650`.
- Pinned account row primary text uses `14px`, `500`; secondary text uses `14px`, `400`.
- Main and submenu text use `scaleX(0.95) scaleY(0.95)`.
- Divider labels use `scaleX(0.95) scaleY(0.9)`.

## States

- Items with no submenu do not get a chevron.
- Items with a submenu use `data-ds-side-toggle`, `aria-expanded`, and `aria-controls`.
- Submenu triggers are true toggles, not one-way expanders.
- Clicking a collapsed submenu trigger expands it.
- Clicking that same expanded submenu trigger again collapses it.
- `Enter` and `Space` must perform the same toggle behavior as click.
- `aria-expanded` must update on every toggle.
- The submenu `data-state` must mirror the trigger state as `expanded` or `collapsed`.
- Expanded chevrons point down.
- Collapsed chevrons point right.
- Submenus default to five rows; set `--ds-side-subitem-count` on a submenu for longer or shorter groups.
- Hover, focus, and optional active states use the shared rounded rectangle background: `--ds-color-clickable-hover-bg`.
- Active state is opt-in with `.is-active` or `aria-current="page"`. No item is highlighted by default.

## Motion Guardrail

Nothing should appear or disappear abruptly. All state changes should ease through one of these:

- background fade for hover and focus
- chevron rotation for submenu state
- submenu max-height, opacity, and vertical slide for open/close
- natural flow movement so lower menu items glide when a submenu opens or closes

The CSS includes a `prefers-reduced-motion` fallback that keeps the interface accessible while preserving the same end states.

## Collapse Behavior

The full-sidebar collapse pattern should keep the icon rail aligned to the open-menu icon positions.

- Collapsed width should be narrow but still reserve a consistent icon column.
- Divider labels and submenu labels disappear in collapsed mode.
- Top-level icons stack at the same `36px` row step.
- Internal submenu toggles should not fire while the full sidebar is collapsed.
- Clicking a collapsed parent item with a submenu should expand the full sidebar first so the submenu is visible.
- Clicking a collapsed item without a submenu may navigate normally.

## System Relationship

Menu rows, command rows, account actions, settings rows, and compact tool lists share the same icon-list contract:

- icon size: `17px`
- icon-to-label gap: `5px`
- text size: `14px`
- standard weight: `500`
- row height: `32px`
- row step: `36px`

Buttons also inherit the same control rhythm: `14px`, `500`, `36px` high, `8px` radius.

## Authenticated Account Placement

When a user is signed in, `.ds-side-account` is required and must always be the final element inside `.ds-side-footer`. The footer is a pinned sibling of `.ds-side-nav`, never a child of the scrolling navigation, so identity remains visible while menu items scroll. Do not place the signed-in identity in the regular menu list, a Manage Account submenu, or a floating card.

The approved block is `52px` high with `12px` outer spacing, a `36px` avatar, a `10px` column gap, paired identity text, and an optional role pill. It has no nested card border or shadow. Primary identity text is `14px` and `500`; secondary identity text is `14px` and `400`. Hover and focus use `--ds-color-clickable-hover-bg`. Role labels such as `Admin` use the shared pill primitive: `14px`, `400`, no shadow, subtle border, raised surface, and capsule radius.

Only the account identity and role collapse; the avatar remains visible in collapsed mode. If no authenticated session exists, do not render `.ds-side-account`.

## Minimal Usage

```html
<link rel="stylesheet" href="/design-system/side-menu/side-menu.css">

<aside class="ds-side-panel ds-side-panel--viewport" data-ds-side-menu data-side-menu-theme="aligned">
  <header class="ds-side-header">
    <img class="ds-side-brand-mark ds-site-icon ds-site-icon--topbar" src="../../assets/site-icon.svg" alt="">
    <div class="ds-side-brand-name">account@example.com</div>
  </header>

  <nav class="ds-side-nav">
    <div class="ds-side-section-label">Build</div>
    <a class="ds-side-item" href="#">
      <svg class="ds-side-icon" viewBox="0 0 20 20" aria-hidden="true"></svg>
      <span class="ds-side-item-label">Compute</span>
    </a>

    <button class="ds-side-item" type="button" data-ds-side-toggle aria-expanded="true" aria-controls="submenu-id">
      <svg class="ds-side-icon" viewBox="0 0 20 20" aria-hidden="true"></svg>
      <span class="ds-side-item-label">Application security</span>
      <i class="ds-side-chevron" aria-hidden="true"></i>
    </button>
    <div class="ds-side-submenu" id="submenu-id">
      <a class="ds-side-subitem" href="#"><span class="ds-side-subitem-label">Security insights</span></a>
      <a class="ds-side-subitem" href="#"><span class="ds-side-subitem-label">WAF</span></a>
    </div>
  </nav>

  <footer class="ds-side-footer">
    <button class="ds-side-account" type="button" aria-label="Manage account for Erinski Easy">
      <span class="ds-side-account__avatar" aria-hidden="true">EE</span>
      <span class="ds-side-account__identity">
        <span class="ds-side-account__name">Erinski Easy</span>
        <span class="ds-side-account__email">erinski.easy@intellibus...</span>
      </span>
      <span class="ds-side-account__role ds-pill">Admin</span>
    </button>
  </footer>
</aside>

<script src="/design-system/side-menu/side-menu.behavior.js"></script>
```

## Porting Checklist

- Replace the app's side panel wrapper with `.ds-side-panel`.
- Put brand/account identity in `.ds-side-header`.
- Put all regular navigation, expandable submenus, and any scrolling command/search control in `.ds-side-nav`.
- On authenticated screens, render `.ds-side-account` as the final child of `.ds-side-footer` and keep that footer outside `.ds-side-nav`.
- Do not replace the signed-in account block with a generic menu row, nested card, Manage Account block, or scrollable item.
- Add chevrons only to rows with submenus.
- Use `.is-active` or `aria-current="page"` only when a route should be visibly selected.
- Override tokens locally instead of editing component CSS when adapting to another app.

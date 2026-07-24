# Aligned Design System

This package captures the aligned interface language as portable CSS and lightweight behavior.

## Import

Use the full bundle:

```html
<link rel="stylesheet" href="/design-system/aligned.css">
```

Or import only the needed component CSS. Component files import their required tokens.

## Component Contracts

The design system includes a component contract suite and a matching Components page. Every tested component has one labeled specimen in the page's three-column grid, and the suite enforces that tests and specimens remain synchronized.

At the end of every code turn that changes interface code, after implementation is complete and before handing work back to the user, run:

```powershell
npm run test:contracts
```

Fix any contract failure and rerun until the suite passes. When a new component contract is added, add its specimen to the Components page using the same contract id. Components without a contract are intentionally ignored. Full maintenance instructions live in `tests/README.md` and `AGENTS.md`.

## Foundation

The system is intentionally quiet: black, white, near-white, gray, thin borders, and restrained blue only for primary actions.

- UI font: `"Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- UI size: `14px`.
- Standard interactive weight: `500`.
- Passive top action weight: `400`.
- Row height: `32px`.
- Row step: `36px`.
- Connected gap: `8px` for related elements such as a trigger and detached menu, or a table and its pagination controls.
- Page gutter: `clamp(20px, 2.5vw, 40px)`.
- Page top gap: `44px`.
- Heading gap: `8px`.
- Intro-to-controls gap: `40px`.
- Page control gap: `12px`.
- Page section gap: `20px`.
- Icon size: `17px`.
- Icon-to-label gap: `5px`.
- Control radius: `8px`.
- Panel radius: `8px`.
- Tiny-card/key radius: `5px`.
- Scrollbar thumb color: `--ds-color-scrollbar-thumb`, a transparent dark gray that visually resolves to the subtle table border tone (`#e2e2e2`) on white/near-white surfaces.

Static/control shadows are standardized to `--ds-shadow-static: 0 2px 8px rgb(0 0 0 / 4%)`. Use this for cards, buttons, filters, upload boxes, side-menu utility controls, and embedded controls when they need softness or separation. Floating overlays keep stronger overlay shadows: modals, command palettes, detached context menus, and opened dropdown cards.

Every light, white, raised, or transparent clickable surface uses `--ds-color-clickable-hover-bg` on hover and keyboard focus. This includes neutral buttons, pill buttons, dropdown triggers and options, menu rows and triggers, command rows, side-menu items, and top-bar actions. Dark primary actions keep their dedicated dark hover token.

Paired text must use the system hierarchy: primary text is `14px`, `500`, and `--ds-color-text-default`; secondary text is `14px`, `400`, and `--ds-color-text-muted`. Do not invent local font sizes or weights for card subtitles, account emails, helper copy, or secondary labels.

## Site Icon

The canonical product mark is `assets/site-icon.svg`. Use `.ds-site-icon.ds-site-icon--topbar` for the `45px` by `25px` sidebar/header placement and `.ds-site-icon.ds-site-icon--auth` for the `40px` by `28px` authentication-tile placement. The browser favicon and every in-product site mark must reference the same SVG asset rather than recreating the mark locally.

Every product page includes the site icon as its SVG favicon by default:

```html
<link rel="icon" type="image/svg+xml" href="assets/site-icon.svg">
```

## Login

`login/login.css` is the approved login component. It includes the complete `320px` responsive form, Google-to-site-icon provider row, account selector, divider, approved pill-button actions, legal links, static shadows, and shared neutral hover behavior. Do not copy its rules into product stylesheets; consume its `ds-login__*` classes directly.

After authentication, the approved identity handoff is `.ds-side-account` inside the pinned `.ds-side-footer`. It must remain at the bottom of the side panel and outside the scrolling navigation on every signed-in screen.

## Uploads

`upload/upload.css` and `upload/upload.behavior.js` define the reusable upload component. It includes idle, dragging, selected, uploading, and success presentation; browse and drag-and-drop selection; file review; reset/remove controls; progress; and an application-facing submit event.

Upload surfaces use the shared panel radius, control border, static shadow, typography hierarchy, button treatment, hover behavior, and smooth motion. The uploaded-file row uses 14px/500 primary text and secondary metadata styling. Simulation is opt-in through `data-ds-upload-demo`; production integrations handle the cancelable `ds-upload:submit` event and control progress through the component API.

## Jobs

`jobs/jobs.css` defines the job-list, inline-details, and focused Easy Apply presentation. It reuses the shared button and upload contracts, keeps one expanded listing at a time, and uses responsive normal-flow layouts instead of fixed page coordinates. Application state belongs to the consuming app; the static showcase behavior is reference-only.

## Buttons

Buttons are part of the same rhythm as menus.

- Text: `14px`.
- Weight: `500`.
- Height: `36px`.
- Horizontal padding: `12px`.
- Radius: `8px`.
- Primary action color: system dark gray.
- Primary dark hover gently washes that dark gray toward the surface instead of changing to a stronger color.
- Neutral/white buttons keep the menu-style light gray hover state.
- Icons use the shared `17px` icon standard.

## Bars

Top bars, bottom bars, footer link rows, and compact utility bars use the same icon/text contract as menu rows.

- Text: `14px`.
- Weight: `400`.
- Color: system dark gray default.
- Icons: `17px`.
- Icon-to-label gap: `5px`.
- Icon stroke: shared `--ds-icon-stroke-width`.
- Links do not introduce one-off colors unless the product explicitly marks them as a primary action.

## Context Menus

Local action menus use the same language at a smaller scale: 32px trigger, rounded hover state, 14px normal-weight items, thin outline, 8px radius, soft shadow, and smooth fade/slide. They borrow modal surface rules without using a full modal overlay.

All popup menus are position-aware. On open, use `AlignedFloating.place(trigger, menu, { root })` so menus expand down by default, expand up when close to the bottom of the viewport, align left by default, and align right when close to the right edge. Open menus use `z-index: 1000`; after close, reset temporary placement state.

## Select Menus

Custom dropdowns are standardized as `select-menu` primitives. The trigger uses 16px normal-weight text, the compact chevron is one 8px by 12px object with 5px marks and 1.75px strokes, and option popovers borrow the modal/context-menu surface language. Options follow the shared 14px, 400, 32/36 row rhythm.

Open dropdowns lift to `z-index: 1000`, then reset after closing. Select menus open as one expanded card: the trigger becomes the selected-value row and the options attach directly beneath it.

Selects use the same position-aware rule as context menus. If there is not enough room beneath the trigger, the option card attaches above the trigger and animates from the bottom edge. If the select is close to the right viewport edge, the popover aligns back toward the left side of the trigger instead of clipping.

Dropdown and filter hover is a two-part rule: the trigger clarifies its surface with `--ds-color-clickable-hover-bg`, `--ds-color-border-hover`, and `--ds-control-hover-shadow`; rows inside the opened menu use the same standard rounded gray hover band. Closed triggers use `--ds-control-shadow`. Open dropdown cards may use the floating overlay shadow.

## Pills

All pills must conform fully to the pill primitive. Pills are compact outlined capsules with no shadow. Text uses the system dark gray at `14px` and `400`. Leading icons always sit in an `18px` dark-gray circle with white `1.5px` linework, and the icon-to-text gap uses the shared `5px` standard. Role labels, status labels, table tags, and selected entities should not create one-off badge styles.

## Tables

`table/table.css` defines the portable table surface. Tables use native table semantics, `16px` horizontal and `12px` vertical cell padding, standard paired typography, subtle row separators, the shared panel radius and static shadow, and `.ds-pill` for compact status values.

## Icon Lists

Any list of rows with icons should use the same icon-list contract: side menus, command rows, settings lists, account actions, and utility panels. Do not reinterpret icon size, icon-label gap, row height, or row step in each component.

## Side Menus

Side menus use a fixed top identity area, internally scrolling nav body, and pinned account/settings footer. Submenu triggers are true toggles: clicking once expands, clicking again collapses. Chevrons animate between right and down states.

## Modals

Modals use a fixed top region, internally scrolling body, and fixed bottom region. The command palette is one modal pattern, not the modal rule itself.

- Aspect ratio: `16 / 9`.
- Header: `58px`.
- Footer: `40px`.
- Border: `1px solid #d9dfe7`.
- Body scrolls internally.

## Scrollbars

All scrollable regions use the custom scrollbar primitive. Native scrollbars are hidden; a thin transparent vertical pill appears on hover, scroll, wheel, pointer movement, or touch pan, then fades out after `1s` of inactivity. The indicator overlays content and never changes layout width. Its fill uses `--ds-color-scrollbar-thumb` so the visible result sits in the same light-gray family as subtle table borders.

The scrollbar primitive must never impose generic positioning on its host. If a scroll region is already `fixed`, `absolute`, `relative`, or `sticky`, that positioning is preserved. Only static hosts may be upgraded to `.is-scrollbar-positioned` by the behavior script.

The indicator is bounded by the scroll container and must never draw into adjacent fixed or pinned regions. Use `data-ds-scrollbar` on any region that scrolls.

Scrollbar visibility is scoped to the active scroll container's own direct child track. Ancestor scroll activity must never reveal scrollbar tracks inside nested popups, dropdowns, menus, or modal bodies.

Collapsed, minimized, icon-only, or otherwise not-full menu states must disable their internal scrolling and hide the scrollbar. Scroll regions that use absolutely positioned children must provide an explicit in-flow scroll extent so the primitive can measure overflow accurately.

Scrollbars are proportional indicators. A scroll container must wrap every item intended to move together; for side menus, search/command controls belong inside the scrolling nav body when they should scroll with the nav. Pinned brand headers and account footers stay outside the scroll container.

## Motion

No state should appear or disappear abruptly. Hover, focus, modal, panel, collapse, and submenu movement should fade, slide, rotate, or otherwise ease smoothly.

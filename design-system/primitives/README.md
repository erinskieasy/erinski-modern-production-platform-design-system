# Aligned Primitives

Primitives are shared rules that should apply beyond one component.

## Radius And Shadows

- Standard rounded rectangles use `--ds-radius-control: 8px`.
- Panels and cards use `--ds-radius-panel: 8px`.
- Tiny cards and keyboard-key chips use `--ds-radius-tiny: 5px`.
- Pills use a capsule radius, and true circular icons use `50%`.
- Static/control shadows use one soft value: `--ds-shadow-static: 0 2px 8px rgb(0 0 0 / 4%)`.
- Floating overlays may use stronger shadows, including modals, command palettes, detached context menus, and opened dropdown cards.

## Icon Lists

Use `icon-list.css` for any repeated row that combines an icon and label: side navigation, command palette rows, settings menus, account actions, and lightweight tool lists.

- Icon size: `17px`.
- Icon-to-label gap: `5px`.
- Text: `14px`, Geist/system stack.
- Default row weight: `500`.
- Secondary text weight: `400`.
- Row height: `32px` inside a `36px` step.

## Text Pairs

- Primary text is always `14px`, `500`, and `--ds-color-text-default`.
- Secondary text is always `14px`, `400`, and `--ds-color-text-muted`.
- Use this hierarchy for account names/emails, card titles/subtitles, file names/details, compact summaries, and any two-line row.
- Do not create local one-off sizes or weights for secondary labels.

## Buttons

Use `buttons.css` for action controls.

- Button text is `14px`.
- Button weight is `500`.
- Button control height is `36px`.
- Button horizontal padding is `12px`.
- Primary buttons use the system dark gray action color, not black and not blue.
- Primary dark button hover is a slight wash-out toward the surface color.
- Neutral/white button hover stays aligned with menu hover: a light gray rounded background.
- Radius is `8px`.
- Top-bar passive actions may use `.ds-top-action`, which keeps the same type size and rhythm but uses `400` weight.

## Bars

Use `bars.css` for top bars, bottom bars, footer link rows, and compact utility bars.

- Bar text is `14px`, `400`, and uses `--ds-color-text-default`.
- Any icon/text pair inside a bar uses the shared `17px` icon and `5px` icon-to-label gap.
- Icon stroke uses `--ds-icon-stroke-width`.
- Muted legal or status text uses `--ds-color-text-muted`.
- Avoid one-off link colors in bars unless the link is a primary action.

## Context Menus

Use `context-menu.css` for small local action menus opened from an ellipsis or compact trigger.

- Detached context menus sit `8px` from their trigger using `--ds-connected-gap`.
- Menus are position-aware: use `floating.behavior.js` and call `AlignedFloating.place(trigger, menu, { root })` before opening.
- Menus open down by default, up when close to the viewport bottom, left-aligned by default, and right-aligned when close to the viewport right edge.
- Trigger size follows the `32px` row height.
- Trigger hover uses the same rounded rectangle as menu rows.
- Menu surface borrows the modal treatment: raised surface, thin outline, `8px` radius, soft shadow, smooth fade/slide.
- Menu items use `14px`, `400`, `32px` height, and the same `36px` step through row gaps.
- Destructive actions use `--ds-color-danger`.

## Select Menus

Use `select-menu.css` and `select-menu.behavior.js` for custom dropdowns that need to behave the same across projects.

- Trigger height is `40px`, with `16px` value text at normal `400` weight.
- Trigger hover/focus clarifies the control surface with `--ds-color-clickable-hover-bg`, `--ds-color-border-hover`, and `--ds-control-hover-shadow`; closed triggers use `--ds-control-shadow`.
- The up/down chevron is one compact select indicator: an `8px` by `12px` box, `5px` marks, and `1.75px` stroke.
- The chevron must read as one object, not two separate icons in a box.
- Popover surface borrows the modal/context-menu treatment: thin outline, `8px` radius, raised surface, floating overlay shadow, smooth fade/slide.
- Open select menus expand as one card: the trigger is the selected-value row and the option list attaches directly beneath it.
- Selects are position-aware: they attach below the trigger by default, attach above it near the viewport bottom, and preserve the same smooth card animation in either direction.
- Open dropdown elements lift to `z-index: 1000` and reset after close.
- Options use the standard list rhythm: `14px`, `400`, `32px` row height, `36px` step.
- Option hover and focus use the standard rounded rectangle background: `--ds-color-clickable-hover-bg`.
- Required behavior: click toggles, outside click closes, `Esc` closes, option click updates `.ds-select-value`, and `aria-expanded` / `aria-selected` stay in sync.

```html
<script src="/design-system/primitives/floating.behavior.js"></script>
<script src="/design-system/primitives/select-menu.behavior.js"></script>

<div class="ds-select-menu" data-ds-select-menu>
  <button class="ds-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="example-menu">
    <span class="ds-select-value">All hostnames</span>
    <i class="ds-select-chevron" aria-hidden="true"></i>
  </button>
  <div class="ds-select-popover" id="example-menu" role="listbox" data-ds-scrollbar hidden>
    <div class="ds-select-options" data-ds-scrollbar-viewport>
      <button class="ds-select-option" type="button" role="option" aria-selected="true">All hostnames</button>
      <button class="ds-select-option" type="button" role="option">Active hostnames</button>
    </div>
  </div>
</div>
```

## Pills

Use `pill.css` for compact inline labels, table values, tags, and selected entities.

- All pills must conform fully to this primitive; do not create one-off badge styles.
- Pills have no shadow.
- Text is `14px`, `400`, and uses the system dark gray instead of black.
- Leading icons always sit inside an `18px` circle.
- Icon linework is white with `1.5px` stroke.
- Icon-to-text gap uses the shared `5px` icon-label gap.
- The pill uses a white/raised surface, subtle border, and full capsule radius.
- Semantic modifiers change only the icon circle: `.is-success`, `.is-warning`, `.is-danger` / `.is-error`, `.is-info`, and `.is-neutral` / `.is-idle`.
- Semantic state must never recolor the pill text, border, or surface.

## Pill Buttons

Use `pill-button.css` for large full-width authentication and account actions. Pill buttons are distinct from compact status pills.

- Height is `56px` with a full capsule radius and the standard static shadow.
- The label remains visually centered at `14px` and `500`.
- The leading icon is a `42px` transparent circle with a control border, positioned `6px` from the pill edge.
- Icon glyphs are `20px` with rounded `1.5px` linework.
- Neutral hover and focus use `--ds-color-clickable-hover-bg`.
- Use `.ds-pill-button`, `.ds-pill-button__icon`, and a label `<span>`; do not recreate this treatment locally.

## Scroll Shells

Use `scroll-shell.css` when a panel needs fixed top and bottom regions with an internally scrolling middle. This is the same structure used by application pages, side menus, and command modals.

- The shell must have a bounded block size.
- Header and footer sizes default to `58px` and `40px` and can be overridden with `--ds-scroll-shell-header-height` and `--ds-scroll-shell-footer-height`.
- Put the custom scrollbar on `.ds-scroll-shell__body-frame`.
- Put `data-ds-scrollbar-viewport` on `.ds-scroll-shell__body`; the scrollbar track stays in the frame and can never cross into the header or footer.

```html
<section class="ds-scroll-shell">
  <header class="ds-scroll-shell__header">Fixed header</header>
  <div class="ds-scroll-shell__body-frame" data-ds-scrollbar>
    <div class="ds-scroll-shell__body" data-ds-scrollbar-viewport>
      Scrollable page content
    </div>
  </div>
  <footer class="ds-scroll-shell__footer">Fixed footer</footer>
</section>
```

## Custom Scrollbars

Use `scrollbar.css` and `scrollbar.behavior.js` on any region that scrolls.

- Add `data-ds-scrollbar` to a non-scrolling frame.
- Add a direct child with `data-ds-scrollbar-viewport`; this child owns `overflow-y: auto` and is the measured scroll viewport.
- The behavior keeps backward compatibility with a host that scrolls itself, but the frame/viewport structure is required whenever the scrollbar must be clipped away from fixed siblings.
- Native scrollbars are hidden.
- The custom indicator is a thin transparent vertical pill.
- The visual pill is `4px` wide inside an `8px` pointer target and supports direct pointer dragging with pointer capture.
- The pill appears on hover, scroll, wheel, pointer movement, or touch pan.
- The pill fades out after `1s` without pointer or scroll activity.
- The indicator overlays content and must not reserve layout width or shift alignment.
- The indicator must never draw outside the scroll container's own visual boundary. It must not enter top bars, footers, pinned account sections, modal headers, modal footers, or sibling regions.
- The track is a direct sibling of the viewport, so scrolling content never moves the track or changes the track's measurement.
- Visibility must be scoped to the active scroll host's own direct child track. Ancestor scroll hosts must not reveal nested popup, dropdown, menu, or modal scrollbar tracks.
- The scroll host must clip the scrollbar to its own top and bottom edges. The pill must not visually pass above or below the area it scrolls.
- The standard scrollbar is proportional: `4px` thumb, `48px` minimum thumb height, and `--ds-color-scrollbar-thumb`, a transparent dark-gray fill calibrated to visually match the subtle table border tone on white/near-white surfaces.
- The primitive must never overwrite the scroll host's existing positioning. Fixed, absolute, sticky, and relative hosts keep their positioning.
- Only naturally static scroll hosts receive `.is-scrollbar-positioned` from behavior so the overlay pill has a containing block.
- Collapsed, minimized, icon-only, hidden-overflow, or otherwise not-full menu states must disable scrolling and hide the custom scrollbar.
- A scroll container must wrap every item that should move together. For a side menu, the search/command control belongs inside the scrolling nav body if it should scroll with the nav.
- Pinned content, such as brand headers and account footers, must sit outside the scroll container.
- If a scroll region positions all of its children absolutely, it must provide an explicit in-flow scroll extent, such as an internal spacer, so overflow and thumb size can be measured correctly.

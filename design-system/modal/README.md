# Aligned Modal System

The aligned modal is a fixed-shape scroll shell: header fixed at the top, footer fixed at the bottom, body scrolling internally.

## Modal Contract

- Width: `min(720px, calc(100vw - 48px))`.
- Aspect ratio: `16 / 9`.
- Header height: `58px`.
- Footer height: `40px`.
- Border: `1px solid #d9dfe7`.
- Radius: `8px`.
- Body scrolls internally and hides scrollbars.
- Open and close should fade and slide smoothly.

## Command Lists

Command rows use the global icon-list rhythm:

- Row height: `32px`.
- Row step: `36px`.
- Icon size: `17px`.
- Icon-label gap: `5px`.
- Prefix weight: `560`.
- Description weight: `400`.
- Dash spacing is symmetrical: prefix-to-dash and dash-to-description both use `8px`.

## Minimal Usage

```html
<button data-ds-modal-trigger="#command-palette">Quick search</button>

<div class="ds-modal-overlay" id="command-palette" data-ds-modal hidden>
  <section class="ds-modal" role="dialog" aria-modal="true" aria-label="Command search">
    <header class="ds-modal__header">
      <div class="ds-command-search">
        <svg class="ds-command-search__icon" viewBox="0 0 20 20" aria-hidden="true"></svg>
        <input class="ds-command-search__input" placeholder="Search products, pages, and features...">
        <kbd class="ds-kbd">Esc</kbd>
      </div>
    </header>
    <div class="ds-modal__body">
      <div class="ds-command-heading">Search tips</div>
      <button class="ds-command-row" type="button">
        <svg class="ds-command-row__icon" viewBox="0 0 20 20" aria-hidden="true"></svg>
        <strong class="ds-command-row__prefix">ask:</strong>
        <span class="ds-command-row__dash" aria-hidden="true"></span>
        <span class="ds-command-row__description">Ask AI</span>
      </button>
    </div>
    <footer class="ds-modal__footer">Footer actions</footer>
  </section>
</div>

<script src="/design-system/modal/modal.behavior.js"></script>
```

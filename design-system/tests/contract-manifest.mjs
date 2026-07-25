export const contractManifest = [
  {
    id: "buttons",
    label: "Buttons",
    css: [
      {
        file: "primitives/buttons.css",
        rules: [
          [".ds-button", "min-block-size: var(--ds-control-height)", "border-radius: var(--ds-radius-control)", "gap: var(--ds-icon-label-gap)"],
          [".ds-button--primary", "background: var(--ds-color-action)", "color: var(--ds-color-text-on-accent)"]
        ]
      }
    ],
    markup: ["class=\"ds-button\"", "ds-button--primary", "type=\"button\""]
  },
  {
    id: "pill",
    label: "Pill",
    css: [
      {
        file: "primitives/pill.css",
        rules: [
          [".ds-pill", "gap: var(--ds-icon-label-gap)", "border-radius: 999px", "font: var(--ds-font-weight-normal)"],
          [".ds-pill__icon", "inline-size: 18px", "block-size: 18px", "border-radius: 50%"],
          [".ds-pill.is-success .ds-pill__icon", "background: var(--ds-color-success)"]
        ]
      }
    ],
    markup: ["ds-pill is-success", "ds-pill is-warning", "ds-pill is-danger", "ds-pill__icon"]
  },
  {
    id: "pill-button",
    label: "Pill Button",
    css: [
      {
        file: "primitives/pill-button.css",
        rules: [
          [".ds-pill-button", "block-size: var(--ds-pill-button-height)", "border-radius: 999px", "box-shadow: var(--ds-shadow-static)"],
          [".ds-pill-button__icon", "inline-size: var(--ds-pill-button-icon-size)", "border-radius: 50%"]
        ]
      }
    ],
    markup: ["class=\"ds-pill-button\"", "ds-pill-button__icon", "type=\"button\""]
  },
  {
    id: "icon-list",
    label: "Icon List",
    css: [
      {
        file: "primitives/icon-list.css",
        rules: [
          [".ds-icon-list", "gap: var(--ds-row-gap)"],
          [".ds-icon-list-row", "grid-template-columns: var(--ds-icon-size) var(--ds-icon-label-gap)", "min-block-size: var(--ds-row-height)"]
        ]
      }
    ],
    markup: ["class=\"ds-icon-list\"", "ds-icon-list-row", "ds-icon-list-icon", "ds-icon-list-label"]
  },
  {
    id: "bar",
    label: "Bar",
    css: [
      {
        file: "primitives/bars.css",
        rules: [
          [".ds-bar", "font: var(--ds-font-weight-normal) var(--ds-font-size-ui)"],
          [".ds-bar__item,\n.ds-bar__link", "gap: var(--ds-icon-label-gap)", "min-block-size: var(--ds-row-height)"]
        ]
      }
    ],
    markup: ["class=\"ds-bar\"", "ds-bar__group", "ds-bar__item", "ds-bar__icon"]
  },
  {
    id: "select-menu",
    label: "Select Menu",
    css: [
      {
        file: "primitives/select-menu.css",
        rules: [
          [".ds-select-trigger", "block-size: 40px", "border-radius: var(--ds-radius-control)", "box-shadow: var(--ds-control-shadow)"],
          [".ds-select-option", "block-size: var(--ds-row-height)", "font: var(--ds-font-weight-normal) var(--ds-font-size-ui)"]
        ]
      }
    ],
    scripts: [
      ["primitives/select-menu.behavior.js", "aria-expanded", "aria-selected", "Escape", "AlignedFloating"]
    ],
    markup: ["data-ds-select-menu", "aria-haspopup=\"listbox\"", "class=\"ds-select-popover\"", "class=\"ds-select-option\""]
  },
  {
    id: "context-menu",
    label: "Context Menu",
    css: [
      {
        file: "primitives/context-menu.css",
        rules: [
          [".ds-context-trigger", "inline-size: var(--ds-row-height)", "block-size: var(--ds-row-height)"],
          [".ds-context-menu", "margin-block-start: var(--ds-connected-gap)", "border-radius: var(--ds-radius-panel)"],
          [".ds-context-menu__item", "block-size: var(--ds-row-height)", "font: var(--ds-font-weight-normal) var(--ds-font-size-ui)"]
        ]
      }
    ],
    markup: ["class=\"ds-context-trigger\"", "aria-haspopup=\"menu\"", "class=\"ds-context-menu is-open\"", "ds-context-menu__item"]
  },
  {
    id: "table",
    label: "Table",
    css: [
      {
        file: "table/table.css",
        rules: [
          [".ds-table", "border-radius: var(--ds-radius-panel)", "box-shadow: var(--ds-shadow-static)"],
          [".ds-table__cell", "padding: 12px 16px", "font-size: var(--ds-font-size-ui)"],
          [".ds-table__head", "background: var(--ds-color-surface-muted)"]
        ]
      }
    ],
    markup: ["class=\"ds-table\"", "class=\"ds-table__element\"", "class=\"ds-table__head\"", "class=\"ds-table__cell\""]
  },
  {
    id: "upload",
    label: "Upload",
    css: [
      {
        file: "upload/upload.css",
        rules: [
          [".ds-upload", "min-block-size: 312px", "border-radius: var(--ds-radius-panel)", "box-shadow: var(--ds-shadow-static)"],
          [".ds-upload__dropzone", "block-size: 150px", "border-radius: var(--ds-radius-control)"]
        ]
      }
    ],
    scripts: [
      ["upload/upload.behavior.js", "ds-upload:submit", "ds-upload:file-selected", "aria-busy", "data-ds-upload"]
    ],
    markup: ["data-ds-upload", "data-ds-upload-dropzone", "data-ds-upload-input", "data-ds-upload-name", "data-ds-upload-size", "data-ds-upload-progress", "data-ds-upload-remove", "data-ds-upload-cancel", "data-ds-upload-submit"]
  },
  {
    id: "login",
    label: "Login",
    css: [
      {
        file: "login/login.css",
        rules: [
          [".ds-login", "inline-size: min(var(--ds-login-width)", "font-family: var(--ds-font-family-ui)"],
          [".ds-login__account", "min-block-size: var(--ds-login-account-min-height)", "border-radius: var(--ds-radius-control)"],
          [".ds-login__actions", "gap: var(--ds-login-action-gap)"]
        ]
      }
    ],
    markup: ["class=\"ds-login\"", "ds-login__brand-row", "ds-login__account-wrap", "ds-login__account", "ds-login__clear", "ds-login__actions"]
  },
  {
    id: "side-menu",
    label: "Side Menu",
    css: [
      {
        file: "side-menu/side-menu.css",
        rules: [
          [".ds-side-panel", "inline-size: var(--ds-side-panel-width)", "display: flex"],
          [".ds-side-nav", "overflow-y: auto", "min-block-size: 0"],
          [".ds-side-footer", "flex: 0 0 var(--ds-side-footer-height)"]
        ]
      }
    ],
    scripts: [
      ["side-menu/side-menu.behavior.js", "aria-expanded", "aria-hidden", "dataset.state", "data-ds-side-toggle"]
    ],
    markup: ["data-ds-side-menu", "class=\"ds-side-header\"", "class=\"ds-side-nav\"", "class=\"ds-side-footer\"", "class=\"ds-side-account\""]
  },
  {
    id: "modal",
    label: "Modal",
    css: [
      {
        file: "modal/modal.css",
        rules: [
          [".ds-modal-overlay", "position: fixed", "z-index: 1000"],
          [".ds-modal", "aspect-ratio: var(--ds-modal-aspect-ratio)", "border-radius: var(--ds-modal-radius)"],
          [".ds-modal__body", "overflow-y: auto"]
        ]
      }
    ],
    scripts: [
      ["modal/modal.behavior.js", "data-ds-modal-trigger", "Escape", "focus", "data-ds-modal-close"]
    ],
    markup: ["data-ds-modal-trigger", "data-ds-modal", "role=\"dialog\"", "aria-modal=\"true\"", "ds-modal__header", "ds-modal__body", "ds-modal__footer"]
  },
  {
    id: "scroll-shell",
    label: "Scroll Shell",
    css: [
      {
        file: "primitives/scroll-shell.css",
        rules: [
          [".ds-scroll-shell", "grid-template-rows: var(--ds-scroll-shell-header-height) minmax(0, 1fr) var(--ds-scroll-shell-footer-height)", "block-size: 100%", "overflow: hidden"],
          [".ds-scroll-shell__body-frame", "position: relative", "min-block-size: 0", "overflow: hidden"],
          [".ds-scroll-shell__body", "block-size: 100%", "overflow-y: auto", "overscroll-behavior: contain"]
        ]
      },
      {
        file: "primitives/scrollbar.css",
        rules: [
          [".ds-scrollbar__thumb", "inline-size: var(--ds-scrollbar-track-inline-size)", "cursor: grab", "pointer-events: auto"]
        ]
      }
    ],
    scripts: [
      ["primitives/scrollbar.behavior.js", "data-ds-scrollbar-viewport", "setPointerCapture", "is-scrollbar-dragging", "ResizeObserver"]
    ],
    markup: ["class=\"ds-scroll-shell\"", "ds-scroll-shell__header", "ds-scroll-shell__body-frame", "data-ds-scrollbar", "data-ds-scrollbar-viewport", "ds-scroll-shell__footer"]
  },
  {
    id: "markdown-editor",
    label: "Markdown Editor",
    css: [
      {
        file: "markdown-editor/markdown-editor.css",
        rules: [
          [".ds-markdown-editor", "display: grid", "font-family: var(--ds-font-family-ui)"],
          [".ds-markdown-editor__surface", "overflow: hidden", "border-radius: var(--ds-radius-control)"],
          [".ds-markdown-editor__textarea", "min-block-size: 250px", "resize: vertical"]
        ]
      }
    ],
    scripts: [
      ["markdown-editor/markdown-editor.behavior.js", "data-ds-markdown-action", "bullet-list", "numbered-list", "ds-markdown:preview", "data-ds-markdown-file"]
    ],
    markup: ["data-ds-markdown-editor", "data-ds-markdown-action=\"bold\"", "data-ds-markdown-action=\"preview\"", "data-ds-markdown-input", "data-ds-markdown-preview", "data-ds-markdown-count"]
  }
];

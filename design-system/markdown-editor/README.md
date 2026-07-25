# Markdown Editor

The Markdown editor is a framework-neutral text area with formatting actions, live character count, text-file import, and a safe built-in preview.

Load `markdown-editor.css` through `aligned.css`, then load the behavior:

```html
<script src="/design-system/markdown-editor/markdown-editor.behavior.js"></script>
```

Use `data-ds-markdown-editor` on the root, `data-ds-markdown-input` on the text area, and `data-ds-markdown-action` on toolbar buttons. Supported actions are `heading`, `bold`, `italic`, `bullet-list`, `numbered-list`, `link`, `import`, and `preview`.

Preview supports headings, paragraphs, ordered and unordered lists, bold, italic, and HTTP(S) links. Consumers that need a full Markdown engine can listen for the cancelable `ds-markdown:preview` event, render into `event.detail.preview`, and call `event.preventDefault()` to bypass the built-in renderer.

The file input is optional. When included, use `data-ds-markdown-file` and accept plain text or Markdown. Imported text is trimmed to the text area's `maxlength`.

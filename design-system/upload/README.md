# Upload

The upload component packages file selection, drag and drop, selected-file review, reset, progress, and completion states in the Aligned visual language.

## Files

- `upload.css` contains the portable component styling.
- `upload.behavior.js` initializes every `[data-ds-upload]` instance independently.
- `upload.example.html` is a complete static implementation.

## Contract

The root uses `.ds-upload[data-ds-upload]`. Required hooks are:

- `[data-ds-upload-dropzone]`
- `[data-ds-upload-input]`
- `[data-ds-upload-name]`
- `[data-ds-upload-size]`
- `[data-ds-upload-progress]`
- `[data-ds-upload-remove]`
- `[data-ds-upload-cancel]`
- `[data-ds-upload-submit]`

The component owns four states: `idle`, `selected`, `uploading`, and `success`. State changes are smooth. Browse, cancel, remove, and submit controls use the shared 36px, 14px/500, 8px-radius button contract. File names use primary text; file details use secondary text. The card, dropzone, file row, and icon tile use the shared border, radius, static shadow, and hover tokens.

## Application Uploads

The behavior dispatches a cancelable `ds-upload:submit` event with the selected `File` at `event.detail.file`. Application code should prevent the default event, perform the real upload, and drive the component through `element.dsUpload`:

```js
upload.addEventListener("ds-upload:submit", async (event) => {
  event.preventDefault();
  upload.dsUpload.setUploading();

  await sendFile(event.detail.file, (percent) => {
    upload.dsUpload.setProgress(percent);
  });

  upload.dsUpload.setSuccess();
});
```

Use `data-ds-upload-demo` only in prototypes and examples. It enables the built-in simulated progress behavior; production components never simulate a successful upload by default.

Available events are `ds-upload:file-selected`, `ds-upload:submit`, `ds-upload:success`, and `ds-upload:reset`.

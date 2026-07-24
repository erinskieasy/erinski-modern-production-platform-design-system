# Jobs

The Jobs pattern provides a progressive application flow in the Aligned visual language: browse a compact list, expand one job inline, and move into a focused Easy Apply view.

## Interaction contract

- A job summary uses `[data-job-toggle]` with `aria-expanded` and `aria-controls`.
- Only one job should be expanded at a time.
- Every `[data-job-apply]` action opens the focused application state for its owning `[data-job]`.
- The application state preserves the selected title, team, full description, and available job metadata.
- `[data-jobs-back]` returns to the list without navigating away from the Jobs page.

## Design-system relationship

The list and detail surfaces consume the shared foundation tokens. Easy Apply uses the shared button rhythm in a compact capsule treatment. The application view directly embeds `.ds-upload`; it does not fork the upload component.

Job rows follow the table spacing contract: `16px` horizontal cell padding, `12px` column gaps, `1px` row separators, and the shared `20px` section gap for expanded content. Easy Apply consumes `.ds-pill` and its approved `18px` leading icon circle.

In production React applications, component state should own expansion and the browse/application transition. The standalone showcase script is reference behavior only.

Production uploads must not use `data-ds-upload-demo`. Listen for `ds-upload:submit`, send the selected file to the production serverless API, and drive progress through `element.dsUpload`.

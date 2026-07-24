# Aligned Foundation Tokens

These files define the shared design language used by every aligned component. Import them before component CSS or use `design-system/aligned.css`.

## Core Contract

- Surfaces stay quiet: white, near-white, black, and gray carry the interface.
- Accent color is reserved for primary actions and explicit status, not broad decoration.
- UI text defaults to `14px` in the Geist/system stack.
- Standard interactive weight is `500`; passive top actions may use `400`.
- Standard row rhythm is a `32px` visible row inside a `36px` step.
- Connected elements use an `8px` gap when they are related but not physically merged.
- Page object spacing rounds to the nearest multiple of `4px`.
- Page gutter is `clamp(20px, 2.5vw, 40px)`.
- Page top gap is `44px`.
- Heading-to-supporting-text gap is `8px`.
- Intro-to-controls gap is `40px`.
- Peer control gap is `12px`.
- Section gap is `20px`.
- Standard icon size is `17px`; standard icon-to-label gap is `5px`.
- Standard control radius is `8px`.
- State changes should ease. Hover, collapse, submenu, modal, and panel movement should never snap.

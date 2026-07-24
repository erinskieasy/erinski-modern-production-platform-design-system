# Erinski Modern Production Platform Design System

A production-oriented design system for building quiet, consistent interfaces with portable CSS, lightweight JavaScript behavior, and explicit component contracts.

## What is included

- Foundation tokens for color, typography, rhythm, and motion
- Reusable buttons, pills, menus, tables, modals, upload surfaces, login flows, side navigation, and scroll primitives
- A browser-based component showcase
- Contract tests that keep documented specimens synchronized with component implementations

## Explore the system

Open `index.html` to browse the component showcase. Detailed usage guidance and component standards are documented in [`design-system/README.md`](design-system/README.md).

Use the complete stylesheet bundle:

```html
<link rel="stylesheet" href="/design-system/aligned.css">
```

Individual component stylesheets can also be imported when a smaller surface is needed.

## Verification

Run the component contract suite:

```powershell
npm run test:contracts
```

## License

Released under the [MIT License](LICENSE).

# Aligned Design System Agent Instructions

At the end of every code turn that changes interface code, run the component contract suite before handing work back to the user:

```powershell
npm run test:contracts
```

If a contract fails, correct the implementation and rerun the suite until it passes. Do not weaken a contract merely to make a failure disappear.

Every component with a contract must also have one labeled specimen on the Components page. When adding a component contract:

1. Add the contract to `tests/contract-manifest.mjs`.
2. Add its labeled specimen to the three-column Components grid in `../index.html` using the same `data-contract-example` id.
3. Add or update the component documentation.
4. Run `npm run test:contracts` before handoff.

Components that do not yet have a contract are outside this suite and should be left unchanged unless the user asks for them to be brought into the design system.

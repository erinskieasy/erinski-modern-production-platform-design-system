# Component Contract Suite

The contract suite checks every recognized Aligned Design System component after interface work is complete. It validates the component's canonical CSS, required markup and accessibility hooks, behavior source, and matching specimen on the Components page.

## Required timing

Run the suite at the end of every code turn that changes interface code, after implementation is complete and before handing the work back to the user:

```powershell
npm run test:contracts
```

Fix contract failures and rerun until the suite passes. Unknown components are intentionally ignored.

## Adding a contract

Each tested component is registered once in `contract-manifest.mjs`. Its id must also appear exactly once as `data-contract-example="..."` on the Components page in `index.html`. The suite enforces this relationship in both directions, so a new test cannot be added without a labeled specimen and a specimen cannot claim coverage without a test.

Contract checks should protect stable design decisions: canonical selectors, tokens, dimensions, structure, ARIA, and component behavior. Avoid encoding subjective page composition or temporary content.

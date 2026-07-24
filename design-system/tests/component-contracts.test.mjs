import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { contractManifest } from "./contract-manifest.mjs";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const designSystemDirectory = path.resolve(testsDirectory, "..");
const projectDirectory = path.resolve(designSystemDirectory, "..");
const pagePath = path.join(projectDirectory, "index.html");
const componentsCssPath = path.join(designSystemDirectory, "components", "components.css");
const bundlePath = path.join(designSystemDirectory, "aligned.css");

const normalize = (value) => value.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

function exampleMarkup(page, id) {
  const pattern = new RegExp(`<article[^>]*data-contract-example=["']${id}["'][^>]*>[\\s\\S]*?<\\/article>`, "i");
  const match = page.match(pattern);
  assert.ok(match, `Components page is missing the ${id} specimen.`);
  return match[0];
}

function ruleBody(css, selector) {
  const normalizedCss = css.replace(/\r\n/g, "\n");
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = normalizedCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "m"));
  assert.ok(match, `Missing canonical CSS rule: ${selector}`);
  return normalize(match[1]);
}

test("Components page and contract manifest stay synchronized", async () => {
  const [page, componentsCss, bundle] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(componentsCssPath, "utf8"),
    readFile(bundlePath, "utf8")
  ]);
  const manifestIds = contractManifest.map(({ id }) => id);
  const specimenIds = [...page.matchAll(/data-contract-example=["']([^"']+)["']/g)].map((match) => match[1]);

  assert.equal(new Set(manifestIds).size, manifestIds.length, "Contract ids must be unique.");
  assert.equal(new Set(specimenIds).size, specimenIds.length, "Components page specimen ids must be unique.");
  assert.deepEqual([...specimenIds].sort(), [...manifestIds].sort(), "Every contract needs exactly one Components page specimen and every specimen needs a contract.");
  assert.match(normalize(componentsCss), /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/, "Components page must use a three-column grid at its primary breakpoint.");
  assert.ok(page.includes("design-system/aligned.css"), "Components page must load the full design-system bundle.");
  assert.ok(page.includes("design-system/components/components.css"), "Components page must load its grid stylesheet.");

  const contractStyles = new Set(contractManifest.flatMap((contract) => (contract.css ?? []).map(({ file }) => file)));
  for (const contractStyle of contractStyles) {
    assert.ok(bundle.includes(`@import url(\"./${contractStyle}\");`), `aligned.css must export the tested component stylesheet: ${contractStyle}`);
  }
});

for (const contract of contractManifest) {
  test(`${contract.label} conforms to its component contract`, async () => {
    const page = await readFile(pagePath, "utf8");
    const specimen = normalize(exampleMarkup(page, contract.id));

    assert.ok(specimen.includes(`>${contract.label}<`), `${contract.label} specimen must display its contract label.`);

    for (const requiredMarkup of contract.markup ?? []) {
      assert.ok(specimen.includes(requiredMarkup), `${contract.label} specimen is missing required markup: ${requiredMarkup}`);
    }

    for (const cssContract of contract.css ?? []) {
      const css = await readFile(path.join(designSystemDirectory, cssContract.file), "utf8");

      for (const [selector, ...declarations] of cssContract.rules) {
        const body = ruleBody(css, selector);
        for (const declaration of declarations) {
          assert.ok(body.includes(normalize(declaration)), `${contract.label} contract ${selector} is missing: ${declaration}`);
        }
      }
    }

    for (const [scriptFile, ...requiredText] of contract.scripts ?? []) {
      const source = await readFile(path.join(designSystemDirectory, scriptFile), "utf8");
      assert.doesNotThrow(() => new Function(source), `${scriptFile} must contain valid JavaScript.`);

      for (const expected of requiredText) {
        assert.ok(source.includes(expected), `${contract.label} behavior is missing: ${expected}`);
      }
    }
  });
}

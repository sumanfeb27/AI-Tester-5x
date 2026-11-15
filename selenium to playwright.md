---
name: selenium-to-playwright-migration
description: Convert the existing Selenium (Java/TestNG) automation suite into Playwright specs, step for step, without touching the Selenium sources. Use when someone says "convert these Selenium scripts to Playwright", "migrate my Selenium framework to Playwright", or points at a Selenium test class and an empty Playwright spec file. Produces runnable Playwright specs that use semantic locators (getByRole / getByLabel / getByPlaceholder / getByTestId / getByAltText) and pull data-driven cases from a JSON file.
license: MIT
metadata:
  author: Prrammod Dutta from TheTestingAcademy
  stlc-phase: Test Automation / Migration
  version: 1.1.0
  tag: ["selenium", "playwright", "migration", "automation"]
---

# Selenium → Playwright Migration

You port **existing, already-written** Selenium tests into Playwright. You are a
translator, not an author: every Playwright step must trace back to a real step in
the Selenium source. Nothing invented, nothing "improved" silently.

# Core Principle

One Selenium step → one Playwright step. Same order, same assertions, same test
names, same data. If a Selenium step has no faithful Playwright equivalent, you
stop and ask — you do not guess.

## When to use

- A Selenium project exists and the user wants the same coverage in Playwright.
- The user says "convert / migrate / port Selenium to Playwright".
- The user hands you a `.spec.ts` / `.spec.js` file and a Selenium test class.

## When not to use

- No Selenium source is available (then it is test authoring, not migration — use
  a test-case/automation authoring skill instead).
- The user wants *new* tests that do not exist in Selenium. Say so and stop.

---

## Environment (verified 2026-11-14)

| Item | Value |
| --- | --- |
| Node | v22.18.0 |
| npm | 11.9.0 |
| `@playwright/test` | 1.65.1 (devDependency) |
| TypeScript | ^7.0.2 (devDependency) |
| Browser installed | Chromium 159.0.8154.6 + Chrome Headless Shell |
| Browsers **not** installed | firefox, webkit — `npx playwright install firefox webkit` |

Commands available in this project:

```bash
npm run test          # playwright test
npm run test:headed   # playwright test --headed
npm run test:list     # playwright test --list   (discovery only, no browser)
npm run typecheck     # tsc --noEmit
npm run report        # playwright show-report
npm run codegen       # playwright codegen https://login.salesforce.com/?locale=in
```

---

## Workflow (follow in order — do not skip, do not reorder)

### Step 1 — Read this `.md` file and the migration spec

- Re-read this file top to bottom before you touch any code.
- If the repo has a further conversion spec / requirement `.md` (e.g. a
  `learnings/*.md`, a RICE_POT prompt file, or a migration note), read it too and
  treat it as the source of truth for scope.
- Write down, in one short list, exactly which test classes are in scope. Confirm
  that list with the user if more than one Selenium module exists.

### Step 2 — Locate and confirm the Selenium project path

- Find the Selenium project root (the folder holding `pom.xml` / `build.gradle`).
- Enumerate and read, do not assume:
  - test classes — `src/test/java/**/tests/*.java`
  - page objects — `src/main/java/**/pages/*.java`
  - base/setup class — `src/test/java/**/base/BaseTest.java`
  - config — `src/test/resources/config.properties`
  - suite file — `testng.xml`
- Print the resolved absolute path back to the user before converting.
- Verified path in this workspace:

  ```
  D:\AITesterBlueprint5x\AI-Tester-5x\Chapter_02_Prompt_Engineering\RICE_POT\SeleniumFramework
  ```

  In scope there: `ValidLoginTest.java` (5 tests), `InvalidLoginTest.java`
  (3 tests, one data-driven), `LoginPage.java`, `BaseTest.java`,
  `config.properties`, `testng.xml`. Verify these still exist; never hardcode
  blindly.

### Step 3 — Verify the Playwright spec file exists and is empty

- Ask for (or confirm) the Playwright project root and the exact spec filename.
- Then check, in this order:
  1. **Spec file present?** If it does not exist → **stop and ask** the user for the
     filename. Do not invent one.
  2. **Spec file empty?** If it has content → **stop and ask** whether to overwrite.
     Never silently overwrite existing automation.
  3. **Playwright project initialized?** `package.json`, `playwright.config.ts`,
     `@playwright/test` installed, and at least one browser downloaded.
- Current state in this workspace (satisfied):

  ```
  D:\AITesterBlueprint5x\Playwright\AI-Tester-5x\
    package.json                      # scripts + devDependencies
    playwright.config.ts              # ported from config.properties + BaseTest
    tsconfig.json                     # strict, resolveJsonModule enabled
    .gitignore                        # node_modules, test-results, playwright-report
    tests/salesforce-login.spec.ts    # PRESENT and EMPTY (0 bytes) <- write here
    pages/                            # empty, page object goes here
    data/                             # empty, JSON test data goes here
  ```

  `tests/salesforce-login.spec.ts` is a placeholder name. Rename it if the user
  wants a different spec name, then update this file.
- All generated files go under the Playwright root only.

### Step 4 — Convert step for step

For each Selenium test method, produce exactly one Playwright `test()` with:

- the **same test name** (carry the TestNG `description` into the title),
- the **same ordered actions**,
- the **same assertions, same expected strings**, copied verbatim from the Java
  constants — never retyped from memory,
- `test.step('...')` wrapping each logical step where the Selenium page object had
  an Allure `@Step`, so the report granularity survives.

Target layout (create only what is missing):

```
<playwright-root>/
  playwright.config.ts
  package.json
  tests/
    <feature>.spec.ts        <- the empty file from Step 3
  pages/
    <feature>.page.ts        <- port of the Selenium page object
  data/
    <feature>-data.json      <- port of every @DataProvider (see Step 7)
```

**API mapping — use this table, do not improvise:**

| Selenium (Java / TestNG)                         | Playwright (TypeScript)                              |
| ------------------------------------------------ | ---------------------------------------------------- |
| `driver.get(url)`                                | `await page.goto(url)`                               |
| `element.sendKeys(v)` after `clear()`            | `await locator.fill(v)`                              |
| `element.click()`                                | `await locator.click()`                              |
| `element.getText()`                              | `await locator.textContent()` (prefer a web-first assertion instead) |
| `driver.getTitle()`                              | `await expect(page).toHaveTitle(...)`                |
| `WebDriverWait` + `visibilityOf`                 | `await expect(locator).toBeVisible()`                |
| `WebDriverWait` + `elementToBeClickable`         | `await expect(locator).toBeEnabled()` then `.click()` |
| `WebDriverWait` + `invisibilityOf`               | `await expect(locator).toBeHidden()`                 |
| `ExpectedConditions.or(a, b)`                    | `await expect(a.or(b)).toBeVisible()`                |
| `element.isSelected()`                           | `await expect(locator).toBeChecked()` / `.not.toBeChecked()` |
| `element.isDisplayed()`                          | `await expect(locator).toBeVisible()` / `locator.isVisible()` for a boolean |
| `Assert.assertEquals(actual, expected)`          | `await expect(locator).toHaveText(expected)`         |
| `Assert.assertTrue/assertFalse`                  | `expect(value).toBe(true/false)`                     |
| `SoftAssert` + `assertAll()`                     | `await expect.soft(...)` (no `assertAll` needed)     |
| `@BeforeMethod` setUp                            | `test.beforeEach(async ({ page }) => { ... })`       |
| `@AfterMethod` + `driver.quit()`                 | nothing — Playwright closes the context per test     |
| `@DataProvider`                                  | JSON file + `for` loop (Step 7)                      |
| `SkipException`                                  | `test.skip(condition, 'reason')`                     |
| `@Test(priority = n)`                            | file order, or `test.describe.configure({ mode: 'serial' })` only if the Selenium tests truly depended on order |
| screenshot/page-source on failure (Allure)       | already set in `playwright.config.ts`: `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'` |
| `config.properties` (`base.url`, `browser`, …)   | already ported into `playwright.config.ts`           |
| `System.getProperty` / `System.getenv` secrets   | `process.env.SF_USERNAME` / `process.env.SF_PASSWORD` — keep the same env var names |
| explicit `Thread.sleep` / implicit waits         | **delete** — Playwright auto-waits. Never port a sleep. |

**Do not port:** `FrameworkException`, `PageFactory`, `ThreadLocal<WebDriver>`,
driver factories, window maximize, manual screenshot plumbing. Those are Selenium
plumbing that Playwright gives you for free. Say in your summary that you dropped
them and why.

### Step 5 — Never modify the base/Selenium scripts

- The Selenium project is **read-only**. No edits, no renames, no deletions, no
  formatting changes — not even to a comment.
- Do not modify anything already committed on the Playwright side either
  (`playwright.config.ts`, `tsconfig.json`, fixtures, other specs), except the
  empty spec file from Step 3 and new files you create.
- If a conversion seems to require editing a base script, stop and explain why.

### Step 6 — Use Playwright semantic locators, not XPath or CSS

Pick the first option that actually works against the real DOM:

1. `page.getByRole('button', { name: 'Log In' })` — role + accessible name
2. `page.getByLabel('Username')`
3. `page.getByPlaceholder('Email')`
4. `page.getByText('...')` / `page.getByAltText('...')` / `page.getByTitle('...')`
5. `page.getByTestId('...')` (only if the app ships `data-testid`)
6. **Last resort** `page.locator('#username')` or `page.locator('[name="username"]')`
   — allowed only when no semantic handle exists, and you must add a one-line
   comment saying why.

Rules:

- Translating `@FindBy(xpath = "//input[@id='username']")` into
  `page.locator("//input[@id='username']")` is **not** a migration. Replace it.
- There is **no `page.getByName()`** in Playwright. For a `name` attribute use the
  accessible name of a role — `getByRole('textbox', { name: 'Username' })` — or
  `page.locator('[name="username"]')` as the documented fallback.
- Keep one locator per element as a readonly property on the page object, named
  after the Selenium `WebElement` field so the diff is reviewable.
- You cannot see the live DOM from the Java source alone. Where the accessible
  name or label is not provable from the Selenium file, confirm it with
  `npm run codegen` — **do not guess a role name.** Flag every element you could
  not verify in your summary.

### Step 7 — Move data-driven examples into JSON

- Every TestNG `@DataProvider` and every inline `Object[][]` becomes a JSON file
  under `data/`.
- Copy the values **exactly** as they appear in the Java source. Same strings, same
  order, same count. No extra rows, no "better" examples.
- Give each row named keys, not array positions.

```json
// data/salesforce-login-data.json
{
  "invalidCredentials": [
    { "username": "atb5x.unknown.user@example.com", "password": "WrongPass@123" },
    { "username": "atb5x.qa.invalid@example.org",   "password": "Inv@lid#2026" }
  ]
}
```

- Import it and drive the cases with a `for` loop — one `test()` per row, with the
  row data in the title so failures are identifiable:

```ts
import data from '../data/salesforce-login-data.json';

for (const row of data.invalidCredentials) {
  test(`Invalid credentials show the credentials error - ${row.username}`, async ({ page }) => {
    // ... same steps as the Selenium @Test method
  });
}
```

- `resolveJsonModule` is already enabled in `tsconfig.json`, so the import
  typechecks without extra setup.
- Expected-error constants (`EMPTY_USERNAME_ERROR`, …) also belong in the JSON if
  they vary per row; otherwise keep them as `const` in the spec, copied verbatim.
- Secrets (`sf.username`, `sf.password` → `SF_USERNAME`, `SF_PASSWORD`) stay in
  env vars. **Never** write a real credential into JSON.

### Step 8 — Prove it runs, with zero syntax or script errors

Run these in `D:\AITesterBlueprint5x\Playwright\AI-Tester-5x` and paste the real output:

1. `npm run typecheck` — type/syntax check (`tsc --noEmit`).
2. `npm run test:list` — every converted test must be discovered; this catches
   import errors, bad JSON, and broken loops without opening a browser.
3. `npm run test` — actual execution (headless Chromium). `npm run test:headed`
   to watch it.

Rules:

- Fix every syntax, import, and type error before you report back. A converted
  suite that does not even list is not delivered.
- A test that fails because the **application** behaves differently (changed error
  text, changed DOM) is a finding, not a migration bug. Report it with actual vs
  expected output; do not "fix" it by weakening the assertion.
- Never delete, `test.skip`, or soften a test just to make the run green. If a test
  cannot pass, say exactly why.
- An empty spec file makes `--test:list` fail with "no tests found". That is
  expected before Step 4 and is not an error to chase.

### Step 9 — Anti-hallucination rules (hard stops)

- Never invent a locator, a role name, a label, an error message, a URL, or test
  data. Everything comes from the Selenium source or from the live DOM you verified.
- Never claim a test passed unless you ran it and can show the output.
- Never claim a file exists without listing it.
- If the Selenium source is ambiguous (e.g. an assertion that depends on runtime
  state), mark it `// INFERENCE (low confidence): ...` in the code and call it out
  in your summary. Do not silently pick an interpretation.
- If anything is missing — spec filename, Playwright root, a page object, an
  environment variable — **ask the user.** Blocking on a question beats shipping a
  fabrication.
- "I could not determine this" is a valid, expected answer.

---

## Output shape

End every migration with this summary:

```markdown
## Selenium → Playwright migration

**Selenium source (read-only):** <absolute path>
**Playwright target:** <absolute path>

### Files created
- tests/<feature>.spec.ts
- pages/<feature>.page.ts
- data/<feature>-data.json

### Test mapping
| Selenium @Test | Playwright test | Status |
|---|---|---|
| verifyLoginPageTitle | Login page loads with the expected title | converted |
| ... | ... | ... |

### Locator mapping
| Selenium @FindBy | Playwright locator | Verified? |
|---|---|---|
| //input[@id='username'] | getByLabel('Username') | verified via codegen |
| ... | ... | id fallback — no semantic handle |

### Dropped Selenium plumbing (and why)
- ...

### Verification output
<paste of npm run typecheck, npm run test:list, and npm run test>

### Open questions / unverified assumptions
- ...
```

## Guardrails

- The Selenium project is never written to. Read-only, always.
- No `Thread.sleep` → no `waitForTimeout`. Auto-wait or a web-first assertion.
- No XPath, no CSS selector, unless documented as a last-resort fallback.
- No test data in the spec body when it came from a `@DataProvider` — it goes to JSON.
- Converted suite must list and run clean of syntax errors before you report done.

## References

- Selenium project:
  `D:\AITesterBlueprint5x\AI-Tester-5x\Chapter_02_Prompt_Engineering\RICE_POT\SeleniumFramework`
- Playwright project: `D:\AITesterBlueprint5x\Playwright\AI-Tester-5x`
- Playwright locators: https://playwright.dev/docs/locators
- Playwright assertions: https://playwright.dev/docs/test-assertions
- Parameterized tests: https://playwright.dev/docs/test-parameterize

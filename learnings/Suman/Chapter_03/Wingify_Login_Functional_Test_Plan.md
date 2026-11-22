# Test Plan: Wingify Login Module (Functional)

| Field | Value |
|---|---|
| **Test Plan ID** | TP-WGF-LOGIN-001 |
| **Title** | Functional Test Plan for the Wingify Login Module |
| **Application URL** | https://app.wingify.com/#/login |
| **Module** | Login / Authentication |
| **Version** | 0.1 (Draft for review) |
| **Prepared by** | Suman — QA Engineer |
| **Date** | 2026-11-20 |
| **Status** | DRAFT — pending human review |

> **How to read this plan**
> - This plan is built **only** from the five approved requirements below. Every scenario traces to a REQ ID.
> - **Requires clarification** marks behaviour the approved requirements do not define. All of these are collected in [Section 11](#11-open-questions--requires-clarification).
> - **(Recommendation)** marks a QA proposal, not approved criteria. Confirm, edit or reject it during review.
> - Fields left as `<fill in>` are decisions the team owns, not things QA should assume.

---

## Approved Requirements (Baseline)

| Req ID | Requirement |
|---|---|
| REQ-01 | Registered users can log in with valid credentials. |
| REQ-02 | Invalid credentials must not grant access. |
| REQ-03 | Email and password are mandatory. |
| REQ-04 | Successful login opens the authenticated dashboard. |
| REQ-05 | Invalid login shows the error message: `Your email, password, IP address or location did not match` |

Nothing outside this table has been treated as approved behaviour.

---

## 1. Test Plan

### 1.1 Objective

Verify that the Wingify login module behaves exactly as defined in REQ-01 to REQ-05:

- A registered user with valid credentials can log in and reach the authenticated dashboard.
- Invalid credentials never grant access, and the approved error message is shown.
- Email and password are both enforced as mandatory.

"Tested" means: every scenario in [Section 2.3](#23-test-scenarios) has been executed on the agreed
environments, each has a recorded pass/fail with evidence, and every P0 scenario passes.

### 1.2 Scope

#### Inclusions (in scope)

| # | Item | Traces to |
|---|---|---|
| 1 | Login with valid registered credentials | REQ-01 |
| 2 | Login with invalid credentials (wrong password, unregistered email) | REQ-02, REQ-05 |
| 3 | Mandatory-field enforcement for email and password (each empty, both empty) | REQ-03 |
| 4 | Landing on the authenticated dashboard after a successful login | REQ-04 |
| 5 | Exact text of the invalid-login error message | REQ-05 |
| 6 | Functional UI behaviour of the login form needed to execute the above (field entry, submit) | REQ-01–05 |

#### Exclusions (out of scope)

Out of scope because the approved requirements do not cover them. Each is listed as an open
question if it may matter for release:

- Registration / sign-up, email verification, password reset and "forgot password" flows
- Single sign-on, social login, OAuth, SAML
- Multi-factor authentication
- Session management: timeout, concurrent sessions, logout, "remember me"
- Account lockout or rate limiting after repeated failures — **Requires clarification** (see OQ-04)
- IP-based and location-based access control — the REQ-05 message text mentions IP address and
  location, but no rule defines that behaviour — **Requires clarification** (see OQ-01)
- Security testing (SQL injection, XSS, brute force), performance and load testing
- Accessibility (WCAG) and localisation / i18n
- Dashboard functionality beyond confirming the authenticated dashboard opens (REQ-04)
- Cross-browser matrix beyond the agreed environments in [Section 3](#3-test-environments)

---

## 2. Test Strategy

### 2.1 Approach

Manual, requirement-driven functional testing of the login module, executed black-box against the
running application at `https://app.wingify.com/#/login`.

1. **Requirement traceability first.** Each scenario maps to at least one REQ ID. A scenario that
   maps to nothing is not executed — it is raised as an open question instead.
2. **Positive path first, then negative, then boundary.** Confirm REQ-01 and REQ-04 work before
   investing in negative coverage, so a broken happy path is found on day one.
3. **Exact-match assertions on the error message.** REQ-05 specifies a literal string, so the
   assertion is a character-exact comparison, not a "contains" check.
4. **Evidence for every execution.** Screenshot of the end state, the URL at that moment, and the
   observed message text. Failures additionally capture browser console output.
5. **No assumed behaviour.** Where the application does something the requirements do not define,
   the result is recorded as an observation and raised as an open question — not passed, not failed.

### 2.2 Test types applied

| Type | Applied? | Notes |
|---|---|---|
| Positive / happy path | Yes | REQ-01, REQ-04 |
| Negative | Yes | REQ-02, REQ-03, REQ-05 |
| Boundary | **Partially** | The only boundary the approved requirements support is the mandatory/empty boundary of REQ-03 (empty vs. one character). Field length limits, password complexity and format rules are **not specified**, so no length or complexity boundary values can be defined without inventing them — see OQ-02 and OQ-03. |
| Exploratory | (Recommendation) | A short time-boxed session on the login form, to surface undefined behaviour early. Findings feed Section 11, not the pass/fail count. |
| Regression | Out of scope for v0.1 | No prior defect history supplied. |

### 2.3 Test Scenarios

Priority: **P0** blocks release, **P1** must pass before sign-off, **P2** should pass.

| ID | Pri | Type | Scenario | Expected result | Traces to |
|---|---|---|---|---|---|
| TS-01 | P0 | Positive | Log in with a valid registered email and valid password | Login succeeds and the authenticated dashboard opens | REQ-01, REQ-04 |
| TS-02 | P0 | Positive | After TS-01, confirm the landed page is the authenticated dashboard (not the login page, no error shown) | Authenticated dashboard is displayed | REQ-04 |
| TS-03 | P0 | Negative | Registered email + incorrect password | Access denied, user stays on the login page, error `Your email, password, IP address or location did not match` is shown | REQ-02, REQ-05 |
| TS-04 | P0 | Negative | Unregistered / non-existent email + any password | Access denied, error message as per REQ-05 | REQ-02, REQ-05 |
| TS-05 | P0 | Negative | Verify the error message text character-for-character against REQ-05 | Displayed text matches `Your email, password, IP address or location did not match` exactly | REQ-05 |
| TS-06 | P0 | Negative / boundary | Email left empty, valid password entered, submit | Login is blocked; email is enforced as mandatory | REQ-03 |
| TS-07 | P0 | Negative / boundary | Valid email entered, password left empty, submit | Login is blocked; password is enforced as mandatory | REQ-03 |
| TS-08 | P1 | Negative / boundary | Both email and password empty, submit | Login is blocked; both fields are enforced as mandatory | REQ-03 |
| TS-09 | P1 | Negative | Invalid credentials submitted, then confirm no authenticated area is reachable (dashboard not rendered, user not logged in) | No access granted | REQ-02 |
| TS-10 | P2 | Negative | Whitespace-only email and/or password submitted | **Requires clarification** — whether whitespace counts as "empty" under REQ-03 is not defined. Record observed behaviour; see OQ-05 | REQ-03 (partial) |
| TS-11 | P2 | Negative | Malformed email (e.g. missing `@`) + any password | **Requires clarification** — no email-format rule is approved. Record observed behaviour; see OQ-02 | REQ-03 (partial) |
| TS-12 | P2 | Negative | Password with correct characters but different letter case | **Requires clarification** — password case-sensitivity is not specified; see OQ-03 | REQ-01 (partial) |

**Expected-result note on TS-06 / TS-07 / TS-08:** REQ-03 states the fields are mandatory but does
**not** state *how* that is enforced (client-side validation message, disabled submit button, or the
REQ-05 server error). The pass condition is therefore "login is blocked"; the precise mechanism and
message are recorded as an observation and raised as **OQ-06**.

**TS-10 to TS-12 do not produce a pass or fail** until the corresponding open question is answered.
They exist to capture actual behaviour so the requirement can be written correctly.

---

## 3. Test Environments

| Attribute | Value |
|---|---|
| Application URL | https://app.wingify.com/#/login |
| Environment | `<fill in — production, staging or a dedicated test environment?>` **(see OQ-07)** |
| Browsers | `<fill in>` — (Recommendation) latest Chrome as the primary browser; add Firefox and Edge if the browser support matrix requires it |
| Operating system | `<fill in>` — (Recommendation) Windows 11 |
| Screen resolution | `<fill in>` — (Recommendation) 1920×1080 desktop |
| Network | Standard office broadband |
| Access prerequisites | Working test account credentials; network access to the application from the tester's IP |

**Risk flagged:** the REQ-05 message text refers to IP address and location, which suggests access
may depend on where the tester runs from. The test environment definition must state the expected
network/IP conditions, or results will not be reproducible. See **R-01** and **OQ-01**.

## 4. Test Data

| Data item | Purpose | Source |
|---|---|---|
| Valid registered email + password | TS-01, TS-02, TS-03, TS-07, TS-12 | `<to be supplied by the team — not recorded in this document>` |
| Unregistered email | TS-04 | Tester-generated, e.g. an address on a domain the team confirms is not registered |
| Incorrect password for a valid account | TS-03 | Tester-generated |
| Empty values | TS-06, TS-07, TS-08 | N/A |
| Whitespace-only values | TS-10 | Tester-generated |
| Malformed email | TS-11 | Tester-generated |

**Data handling rules**

- Real credentials are **never** written into this plan, into test cases, or into any committed file.
  They are supplied through a password manager or an environment variable at execution time.
- Test accounts must be dedicated to testing. Do not use a personal or customer account.
- At least one known-good registered account is a **hard prerequisite**: without it, TS-01, TS-02,
  TS-03, TS-07 and TS-12 cannot be executed at all. See **R-02**.

---

## 5. Entry and Exit Criteria

### 5.1 Test Design

**Entry criteria**

- The five approved requirements (REQ-01 to REQ-05) are available and confirmed. ✅ Met
- The application URL is known. ✅ Met
- This test plan is reviewed and approved by the QA owner.

**Exit criteria**

- Test scenarios are written and traced to REQ IDs. ✅ Met (Section 2.3)
- Open questions are documented and routed to the requirement author. ✅ Met (Section 11)
- Test data requirements are identified. ✅ Met (Section 4)

### 5.2 Test Execution

**Entry criteria**

- This plan is approved (Section 12).
- The test environment is available and reachable, and the login page loads.
- Valid test account credentials have been supplied.
- The defect reporting tool and project are available to the tester.

**Exit criteria**

- All P0 and P1 scenarios have been executed with a recorded result and evidence.
- All P0 scenarios pass.
- No open P0 or P1 defect in the login module, or each has a documented, signed-off waiver.
- Every scenario marked **Requires clarification** has either been answered and re-executed, or
  explicitly deferred with the deferral recorded.

### 5.3 Test Closure

**Entry criteria**

- Test execution exit criteria are met.
- All defects are triaged: fixed and retested, deferred, or rejected with a reason.

**Exit criteria**

- Test summary report produced and shared (Section 6).
- Traceability from each REQ ID to its executed scenarios and results is complete.
- Open questions that remain unresolved are handed over as known gaps, in writing.
- QA owner signs off in Section 12.

---

## 6. Test Deliverables

| # | Deliverable | Produced when | Owner |
|---|---|---|---|
| 1 | This test plan (TP-WGF-LOGIN-001) | Before execution | QA |
| 2 | Test cases / test scenario sheet with steps and expected results | Before execution | QA |
| 3 | Test execution results with pass/fail per scenario | During execution | QA |
| 4 | Evidence pack: screenshots, URLs, observed message text, console logs on failure | During execution | QA |
| 5 | Defect reports | During execution | QA |
| 6 | Requirement traceability matrix (REQ-01…REQ-05 → TS IDs → result) | At closure | QA |
| 7 | Test summary report, including unresolved open questions | At closure | QA |

---

## 7. Defect Reporting Procedure

Tool: `<fill in — JIRA or the team's tracker?>` **(see OQ-08)**

**Every defect report contains**

1. **Title** — one line: what failed, where.
2. **Requirement reference** — the REQ ID the defect violates. A defect that violates no REQ ID is
   filed as an observation or a requirement query, not a bug.
3. **Environment** — URL, browser and version, OS, date and time of execution.
4. **Test data used** — account type and input shape. **Never the actual password.**
5. **Steps to reproduce** — numbered, starting from the login page.
6. **Expected result** — quoted from the requirement.
7. **Actual result** — exactly what happened, including the verbatim message text displayed.
8. **Evidence** — screenshot, and the browser console output for any failure.
9. **Severity and priority** — proposed by QA, confirmed at triage.

**Severity guide**

| Severity | Definition for this module |
|---|---|
| Critical | Invalid credentials grant access (REQ-02 violated), or no user can log in (REQ-01 violated) |
| High | Successful login does not open the dashboard (REQ-04), or a mandatory field is not enforced (REQ-03) |
| Medium | Wrong or missing error message on invalid login (REQ-05) |
| Low | Cosmetic issue on the login form that does not block any requirement |

**Flow:** QA logs the defect → triage with the requirement author and developer → fixed → QA retests
on the same environment → QA closes, or reopens with new evidence.

---

## 8. Test Schedule

**No dates were supplied with the requirements, so no schedule has been invented.** The table below
is the shape to fill in at review. Effort figures are QA estimates for 12 scenarios, not commitments.

| Phase | Effort estimate (Recommendation) | Start | End | Owner |
|---|---|---|---|---|
| Test planning (this document) | 0.5 day | `<fill in>` | `<fill in>` | Suman |
| Plan review and approval | 0.5 day | `<fill in>` | `<fill in>` | QA owner |
| Test case design | 0.5 day | `<fill in>` | `<fill in>` | Suman |
| Test environment and data setup | 0.5 day | `<fill in>` | `<fill in>` | `<fill in>` |
| Test execution (cycle 1) | 1 day | `<fill in>` | `<fill in>` | Suman |
| Defect fixing and retest (cycle 2) | 0.5 day | `<fill in>` | `<fill in>` | Dev + QA |
| Test closure and summary report | 0.5 day | `<fill in>` | `<fill in>` | Suman |

See **OQ-09** — the schedule cannot be finalised without the target release date.

---

## 9. Tools

No toolchain was specified in the requirements. These are proposals for review.

| Purpose | Tool | Status |
|---|---|---|
| Test case and result management | `<fill in>` | **Requires clarification** (OQ-08) |
| Defect tracking | `<fill in>` | **Requires clarification** (OQ-08) |
| Browser | Google Chrome (latest) | (Recommendation) |
| Evidence capture | OS screenshot tool; browser DevTools for console and network | (Recommendation) |
| Test data / credential handling | Team password manager or environment variables | (Recommendation) |
| Automation | Out of scope for this plan. Candidate for a follow-up once REQ-01 to REQ-05 are confirmed stable | (Recommendation) |

---

## 10. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | REQ-05's message mentions IP address and location, but no IP/location rule is approved. Results may differ by tester location or network, making failures non-reproducible. | Medium | High | Resolve OQ-01 before execution. Record the tester's network and approximate location with every invalid-login result. |
| R-02 | No valid test account has been supplied. Five scenarios including both P0 positive cases cannot run. | High | High | Treat a working test account as a hard entry criterion for execution (Section 5.2). Request it at plan approval. |
| R-03 | Requirements are silent on empty-field error text, email format, password rules, case sensitivity and lockout. Testers could score undefined behaviour as pass or fail inconsistently. | High | Medium | TS-10 to TS-12 record observations only and produce no pass/fail until the matching open question is answered. |
| R-04 | If the environment is production, failed-login attempts could trigger real security controls such as lockout or IP blocking, and could pollute real data. | Medium | High | Resolve OQ-07. Prefer a non-production environment; if production is the only option, agree an attempt limit and an unlock path in writing before starting. |
| R-05 | The login page is a single-page application (`/#/login`). Dashboard state may change without a full page load, so a URL check alone may not prove REQ-04. | Medium | Medium | Assert on an element that only the authenticated dashboard renders, in addition to the URL. |
| R-06 | Requirements may change after this plan is approved. | Medium | Medium | Version this plan. Re-run the traceability matrix on every requirement change. |
| R-07 | A single manual execution cycle may miss intermittent behaviour, e.g. a session or timing issue. | Low | Medium | Repeat TS-01 and TS-03 at least twice in different sessions. Note any variance. |

---

## 11. Open Questions / Requires Clarification

These block full sign-off. Each is addressed to the requirement author.

| ID | Area | Question | Blocks |
|---|---|---|---|
| OQ-01 | IP / location | REQ-05's message names IP address and location as failure reasons, but no requirement defines IP or location-based access rules. Are there any? If yes, what are the expected behaviours and from which networks should testing run? | TS-03, TS-04, TS-05, R-01 |
| OQ-02 | Email format | Is there an email format validation rule, and what is the expected behaviour and message for a malformed email? | TS-11 |
| OQ-03 | Password rules | Are there password rules — minimum/maximum length, allowed characters, case sensitivity? Boundary values cannot be chosen without them. | TS-12, Section 2.2 |
| OQ-04 | Lockout | Is there account lockout, rate limiting or CAPTCHA after repeated failed attempts? If yes, after how many, and what is the expected message and recovery path? | R-04, Section 1.2 |
| OQ-05 | Whitespace | Does a whitespace-only entry count as empty for REQ-03's mandatory check? | TS-10 |
| OQ-06 | Mandatory-field behaviour | How is REQ-03 enforced, and what exactly should the user see — a client-side validation message, a disabled submit button, or the REQ-05 error? Is the message the same for email-empty, password-empty and both-empty? | TS-06, TS-07, TS-08 |
| OQ-07 | Environment | Which environment should be tested — production, staging or a dedicated test environment? What is its URL if not `app.wingify.com`? | Section 3, R-04 |
| OQ-08 | Tooling | Which test management and defect tracking tools should be used, and in which project? | Sections 7, 9 |
| OQ-09 | Schedule | What is the target release date and the available testing window? | Section 8 |
| OQ-10 | Dashboard definition | What specifically identifies "the authenticated dashboard" in REQ-04 — a URL, a page title, or a particular element? The pass criterion for TS-02 depends on this. | TS-02, R-05 |
| OQ-11 | Browser matrix | Which browsers, versions and operating systems are in the supported matrix? | Section 3 |

---

## 12. Approvals

| Role | Name | Decision | Date | Comments |
|---|---|---|---|---|
| QA Engineer (author) | Suman | Submitted for review | 2026-11-20 | |
| QA Lead / Owner | `<fill in>` | `<pending>` | | |
| Product / Requirement author | `<fill in>` | `<pending>` | | |
| Engineering lead | `<fill in>` | `<pending>` | | |

---

## HUMAN REVIEW GATE

**I assumed:**

- The five requirements in the STAR prompt are the complete, approved baseline, and that
  `https://app.wingify.com/#/login` is the correct page under test.
- "Blocked login" is a sufficient pass condition for REQ-03, since the enforcement mechanism is
  not specified (OQ-06).

**I could not confirm, and did not invent:**

- Any IP or location access rule, despite REQ-05's message naming both (OQ-01).
- Email format rules, password rules and case sensitivity — so **no length or complexity boundary values appear in this plan**. The only boundary the requirements support is empty vs. non-empty.
- Lockout or rate-limiting behaviour (OQ-04).
- The target environment, tools, browser matrix and schedule — these are left as `<fill in>`
  rather than filled with plausible-looking values.
- What exactly identifies the authenticated dashboard (OQ-10).

**Open questions blocking sign-off:** OQ-01, OQ-06, OQ-07 and OQ-10 affect pass/fail criteria
directly. OQ-02, OQ-03 and OQ-05 keep TS-10 to TS-12 unscoreable. The rest block planning, not
execution.

**Approve, or edit, before test cases or automation are written from this plan.**

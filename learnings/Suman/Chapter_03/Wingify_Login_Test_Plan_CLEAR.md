# Test Plan: Wingify Login Module (CLEAR)

| Field | Value |
|---|---|
| **Test Plan ID** | TP-WGF-LOGIN-002 |
| **Title** | Functional Test Plan for the Wingify Login Module (CLEAR) |
| **Application URL** | https://app.wingify.com/#/login |
| **Module** | Login / Authentication |
| **Version** | 0.1 (Draft for review) |
| **Prepared by** | Suman — QA Engineer |
| **Date** | 2026-11-21 |
| **Prompt framework** | CLEAR — Context, Limits, Examples, Action, Review |
| **Status** | DRAFT — pending human review |

> **How to read this plan**
> - Built **only** from the five approved requirements below. Every test case traces to a REQ ID.
> - **Requires clarification** marks behaviour the requirements do not define. Collected in [Section 14](#14-open-questions--requires-clarification).
> - **(Recommendation)** marks a QA proposal, not approved criteria.
> - `<fill in>` marks an input the team owns. It has not been guessed at.
> - All 10 test cases are **Not Run**. Nothing in this plan has been executed.

---

## 2. Approved Requirements (Baseline)

| Req ID | Requirement |
|---|---|
| REQ-01 | Registered users can log in with valid credentials. |
| REQ-02 | Invalid credentials must not grant access. |
| REQ-03 | Email and password are mandatory. |
| REQ-04 | Successful login opens the authenticated dashboard. |
| REQ-05 | Invalid login shows the error message: `Your email, password, IP address or location did not match` |

---

## 3. Objective

Verify that the Wingify login module behaves as defined in REQ-01 to REQ-05: valid registered
credentials grant access and open the authenticated dashboard, invalid credentials never grant
access and show the approved error message, and both email and password are enforced as mandatory.

"Tested" means all 10 test cases in [Section 6](#6-test-scenarios) have been executed on the agreed
environment with recorded evidence, and every High-priority case passes.

---

## 4. Scope

### 4.1 Inclusions

| # | Item | Traces to |
|---|---|---|
| 1 | Login with valid registered credentials | REQ-01 |
| 2 | Landing on the authenticated dashboard after successful login | REQ-04 |
| 3 | Login with an incorrect password for a registered email | REQ-02, REQ-05 |
| 4 | Login with an unregistered email | REQ-02, REQ-05 |
| 5 | Mandatory-field enforcement: empty email, empty password, both empty | REQ-03 |
| 6 | Exact text of the invalid-login error message | REQ-05 |
| 7 | Access control before login and after a failed login | REQ-02 |

### 4.2 Exclusions

Excluded because no approved requirement covers them:

- Registration, email verification, forgot password and password reset
- Single sign-on, social login, multi-factor authentication
- Session timeout, concurrent sessions, logout, "remember me"
- Account lockout, rate limiting and CAPTCHA — **Requires clarification** (OQ-04)
- IP-based and location-based access rules — the REQ-05 text names IP address and location, but no rule defines the behaviour — **Requires clarification** (OQ-01)
- Password policy, email format validation — **Requires clarification** (OQ-02, OQ-03)
- Security, performance, accessibility and localisation testing
- Dashboard functionality beyond confirming it opens (REQ-04)
- Automation — candidate for a follow-up once REQ-01 to REQ-05 are confirmed stable **(Recommendation)**

---

## 5. Test Strategy and Approach

1. **Requirement-driven.** Each of the 10 test cases maps to at least one REQ ID. Anything that maps to nothing becomes an open question, not a test.
2. **Black-box, manual execution** against the running application at `https://app.wingify.com/#/login`.
3. **Positive first.** TC-001 and TC-002 run before the negative set, so a broken happy path is found immediately.
4. **Exact-match assertion on the error message.** REQ-05 specifies a literal string, so TC-005 compares character-for-character, not "contains".
5. **Credential placeholders only.** `<registered_email>` and `<valid_password>` are resolved at execution time from the team password manager. No credential is written into this plan, the test cases or any committed file.
6. **Undefined behaviour is recorded, not scored.** Where the requirements are silent (for example the message shown for an empty field), the tester records what actually happened and raises the open question. The case is not marked Passed or Failed on invented criteria.
7. **Evidence for every execution.** Screenshot of the end state, the URL at that moment, and the verbatim message text. Failures also capture browser console output.

### 5.1 Test types

| Type | Cases | Notes |
|---|---|---|
| Positive | TC-001, TC-002 | REQ-01, REQ-04 |
| Negative | TC-003 to TC-008, TC-010 | REQ-02, REQ-03, REQ-05 |
| Boundary | TC-006, TC-007, TC-008 | The mandatory/empty boundary of REQ-03 is the only boundary the requirements support. Length and complexity boundaries cannot be defined without inventing rules — see OQ-02 and OQ-03. |
| Security-adjacent (access control) | TC-009, TC-010 | Functional access checks only, not security testing |

---

## 6. Test Scenarios

Jira-style table. Exact import compatibility requires the Jira project and the test-management
app's field mapping.

| Test Case ID | Requirement | Summary | Preconditions | Test Data | Steps | Expected Result | Priority | Test Type | Status |
|---|---|---|---|---|---|---|---|---|---|
| WGF-LOGIN-TC-001 | REQ-01, REQ-04 | Verify login with valid registered credentials | An active registered test account is available; the user is logged out | `<registered_email>`, `<valid_password>` | 1. Open the login URL. 2. Enter the registered email. 3. Enter the valid password. 4. Submit the login form. | Login succeeds and the authenticated dashboard opens | High | Positive | Not Run |
| WGF-LOGIN-TC-002 | REQ-04 | Verify the authenticated dashboard is displayed after a successful login | TC-001 has been executed successfully | `<registered_email>`, `<valid_password>` | 1. Complete a successful login. 2. Observe the page that is displayed. 3. Confirm the login form is no longer shown. 4. Confirm no error message is shown. | The authenticated dashboard is displayed in place of the login form, with no error message. **Requires clarification:** the exact element or URL that identifies the dashboard is not specified (OQ-10) | High | Positive | Not Run |
| WGF-LOGIN-TC-003 | REQ-02, REQ-05 | Verify login is rejected for a registered email with an incorrect password | An active registered test account is available; the user is logged out | `<registered_email>`, `<incorrect_password>` | 1. Open the login URL. 2. Enter the registered email. 3. Enter an incorrect password. 4. Submit the login form. | Access is not granted, the user remains on the login page, and the error `Your email, password, IP address or location did not match` is displayed | High | Negative | Not Run |
| WGF-LOGIN-TC-004 | REQ-02, REQ-05 | Verify login is rejected for an unregistered email | The email used is confirmed not registered; the user is logged out | `<unregistered_email>`, `<any_password>` | 1. Open the login URL. 2. Enter the unregistered email. 3. Enter any password. 4. Submit the login form. | Access is not granted and the error `Your email, password, IP address or location did not match` is displayed | High | Negative | Not Run |
| WGF-LOGIN-TC-005 | REQ-05 | Verify the invalid-login error message text matches the requirement exactly | TC-003 or TC-004 has produced an error message | `<registered_email>`, `<incorrect_password>` | 1. Submit invalid credentials. 2. Locate the displayed error message. 3. Compare the displayed text character-for-character with the approved text. | The displayed text is exactly `Your email, password, IP address or location did not match`, with no additional or missing characters | High | Negative | Not Run |
| WGF-LOGIN-TC-006 | REQ-03 | Verify login is blocked when the email field is empty | The user is logged out and on the login page | email: empty, `<valid_password>` | 1. Open the login URL. 2. Leave the email field empty. 3. Enter a password. 4. Submit the login form. | Login is blocked and the email field is enforced as mandatory. **Requires clarification:** the enforcement mechanism and the message shown are not specified (OQ-06) | High | Negative / boundary | Not Run |
| WGF-LOGIN-TC-007 | REQ-03 | Verify login is blocked when the password field is empty | The user is logged out and on the login page | `<registered_email>`, password: empty | 1. Open the login URL. 2. Enter the registered email. 3. Leave the password field empty. 4. Submit the login form. | Login is blocked and the password field is enforced as mandatory. **Requires clarification:** the enforcement mechanism and the message shown are not specified (OQ-06) | High | Negative / boundary | Not Run |
| WGF-LOGIN-TC-008 | REQ-03 | Verify login is blocked when both email and password are empty | The user is logged out and on the login page | email: empty, password: empty | 1. Open the login URL. 2. Leave both fields empty. 3. Submit the login form. 4. Observe the response. | Login is blocked and both fields are enforced as mandatory. **Requires clarification:** whether one combined message or two separate messages are expected is not specified (OQ-06) | Medium | Negative / boundary | Not Run |
| WGF-LOGIN-TC-009 | REQ-02 (partial), REQ-04 | Verify the authenticated dashboard is not displayed before logging in | The user is logged out with no active session | None | 1. Open the login URL while logged out. 2. Attempt to reach the authenticated dashboard without submitting credentials. 3. Observe the page displayed. | The authenticated dashboard is not displayed. **Requires clarification:** REQ-02 covers invalid credentials, not access with no credentials, and the expected handling (redirect to login, or an error) is not specified (OQ-12) | Medium | Negative | Not Run |
| WGF-LOGIN-TC-010 | REQ-02 | Verify no access is granted after a failed login attempt | TC-003 has been executed and produced an error | `<registered_email>`, `<incorrect_password>` | 1. Submit invalid credentials and confirm the error appears. 2. Confirm the login form is still displayed. 3. Confirm the authenticated dashboard is not displayed. 4. Confirm the user is not logged in. | No access is granted; the user remains unauthenticated on the login page | High | Negative | Not Run |

**Coverage check:** 10 distinct test cases. REQ-01 → TC-001. REQ-02 → TC-003, TC-004, TC-009, TC-010.
REQ-03 → TC-006, TC-007, TC-008. REQ-04 → TC-001, TC-002, TC-009. REQ-05 → TC-003, TC-004, TC-005.
Every requirement is covered; every case traces to at least one requirement.

---

## 7. Test Environment and Test Data

### 7.1 Environment

| Attribute | Value |
|---|---|
| Application URL | https://app.wingify.com/#/login |
| Environment | `<fill in — production, staging or a dedicated test environment?>` (OQ-07) |
| Browsers | `<fill in>` — latest Chrome as primary **(Recommendation)** |
| Operating system | `<fill in>` — Windows 11 **(Recommendation)** |
| Resolution | `<fill in>` — 1920×1080 desktop **(Recommendation)** |
| Network / IP conditions | `<fill in>` — must be stated, because the REQ-05 message names IP address and location (OQ-01, R-01) |
| Access prerequisites | A working registered test account; network access from the tester's location |

### 7.2 Test data

| Placeholder | Purpose | Source |
|---|---|---|
| `<registered_email>` | TC-001, TC-002, TC-003, TC-005, TC-007, TC-010 | Supplied by the team at execution time |
| `<valid_password>` | TC-001, TC-002, TC-006 | Team password manager — never recorded in this document |
| `<incorrect_password>` | TC-003, TC-005, TC-010 | Tester-generated |
| `<unregistered_email>` | TC-004 | Tester-generated on a domain confirmed not registered |
| `<any_password>` | TC-004 | Tester-generated |
| Empty values | TC-006, TC-007, TC-008 | N/A |

**Rules:** real credentials never appear in this plan, in test cases or in any committed file.
Test accounts must be dedicated to testing, never a personal or customer account. A working
registered account is a hard prerequisite — without it TC-001, TC-002, TC-003, TC-005, TC-007
and TC-010 cannot be executed at all (R-02).

---

## 8. Entry and Exit Criteria

### 8.1 Test Design

**Entry:** approved requirements REQ-01 to REQ-05 available ✅; application URL known ✅; this plan reviewed and approved.
**Exit:** 10 test cases written and traced to REQ IDs ✅; open questions documented and routed to the requirement author ✅; test data placeholders identified ✅.

### 8.2 Test Execution

**Entry:** this plan approved (Section 15); environment available and the login page loads; registered test account supplied; defect tracker available to the tester.
**Exit:** all 10 cases executed with a recorded result and evidence; every High-priority case passes; no open High-severity defect without a signed-off waiver; every "Requires clarification" item either answered and re-executed, or explicitly deferred in writing.

### 8.3 Test Closure

**Entry:** execution exit criteria met; all defects triaged — fixed and retested, deferred, or rejected with a reason.
**Exit:** test summary report shared; traceability from REQ-01…REQ-05 to cases and results complete; unresolved open questions handed over as known gaps; QA owner signs off.

---

## 9. Test Deliverables

| # | Deliverable | Produced when | Owner |
|---|---|---|---|
| 1 | This test plan (TP-WGF-LOGIN-002) | Before execution | QA |
| 2 | The 10 test cases, exported to the test management tool | Before execution | QA |
| 3 | Execution results, pass/fail per case | During execution | QA |
| 4 | Evidence pack: screenshots, URLs, verbatim message text, console logs on failure | During execution | QA |
| 5 | Defect reports | During execution | QA |
| 6 | Requirement traceability matrix (REQ → TC → result) | At closure | QA |
| 7 | Test summary report including unresolved open questions | At closure | QA |

---

## 10. Defect Reporting Procedure

Tool: `<fill in — JIRA or the team's tracker?>` (OQ-08)

**Every defect report contains:** title; the REQ ID violated; environment (URL, browser and version, OS, date and time); test case ID; test data shape used — **never the actual password**; numbered steps to reproduce from the login page; expected result quoted from the requirement; actual result including the verbatim message displayed; evidence; proposed severity and priority.

| Severity | Definition for this module |
|---|---|
| Critical | Invalid credentials grant access (REQ-02), or no user can log in (REQ-01) |
| High | Successful login does not open the dashboard (REQ-04), or a mandatory field is not enforced (REQ-03) |
| Medium | Wrong or missing error message on invalid login (REQ-05) |
| Low | Cosmetic issue on the login form that blocks no requirement |

**Flow:** QA logs → triage with requirement author and developer → fix → QA retests on the same environment → QA closes, or reopens with new evidence.

A defect that violates no REQ ID is filed as an observation or a requirement query, not a bug.

---

## 11. Test Schedule

No dates were supplied, so no schedule has been invented. Effort figures are QA estimates for 10 test cases, not commitments.

| Phase | Effort estimate **(Recommendation)** | Start | End | Owner |
|---|---|---|---|---|
| Test planning (this document) | 0.5 day | `<fill in>` | `<fill in>` | Suman |
| Plan review and approval | 0.5 day | `<fill in>` | `<fill in>` | QA owner |
| Test case export and setup | 0.5 day | `<fill in>` | `<fill in>` | Suman |
| Environment and test data setup | 0.5 day | `<fill in>` | `<fill in>` | `<fill in>` |
| Execution cycle 1 | 1 day | `<fill in>` | `<fill in>` | Suman |
| Defect fixing and retest | 0.5 day | `<fill in>` | `<fill in>` | Dev + QA |
| Closure and summary report | 0.5 day | `<fill in>` | `<fill in>` | Suman |

Cannot be finalised without the target release date (OQ-09).

---

## 12. Tools

| Purpose | Tool | Status |
|---|---|---|
| Test case management | `<fill in>` | **Requires clarification** (OQ-08) |
| Defect tracking | `<fill in>` | **Requires clarification** (OQ-08) |
| Browser | Google Chrome (latest) | **(Recommendation)** |
| Evidence capture | OS screenshot tool; browser DevTools for console and network | **(Recommendation)** |
| Credential handling | Team password manager or environment variables | **(Recommendation)** |
| Automation | Out of scope for this plan | **(Recommendation)** |

---

## 13. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | REQ-05's message names IP address and location, but no IP or location rule is approved. Results may differ by tester network, making failures non-reproducible. | Medium | High | Resolve OQ-01 before execution. Record the tester's network and approximate location with every invalid-login result. |
| R-02 | No registered test account supplied. Six of the ten cases, including both positive cases, cannot run. | High | High | Treat a working test account as a hard entry criterion (Section 8.2). Request it at plan approval. |
| R-03 | Requirements are silent on empty-field messages, email format, password rules and lockout. Testers could score undefined behaviour inconsistently. | High | Medium | TC-002, TC-006, TC-007, TC-008 and TC-009 carry explicit "Requires clarification" notes; the undefined part is recorded as an observation, not scored. |
| R-04 | If the environment is production, repeated failed logins could trigger real security controls or pollute real data. | Medium | High | Resolve OQ-07. Prefer non-production. If production is the only option, agree an attempt limit and an unlock path in writing first. |
| R-05 | The page is a single-page application (`/#/login`), so dashboard state may change without a full page load and a URL check alone may not prove REQ-04. | Medium | Medium | Assert on an element only the authenticated dashboard renders, once OQ-10 defines it. |
| R-06 | Requirements may change after approval. | Medium | Medium | Version this plan; re-run traceability on every requirement change. |
| R-07 | A single manual cycle may miss intermittent behaviour. | Low | Medium | Repeat TC-001 and TC-003 at least twice in separate sessions and note any variance. |

---

## 14. Open Questions / Requires Clarification

| ID | Area | Question | Blocks |
|---|---|---|---|
| OQ-01 | IP / location | REQ-05's message names IP address and location as failure reasons, but no requirement defines IP or location rules. Are there any, and from which networks should testing run? | TC-003, TC-004, TC-005, R-01 |
| OQ-02 | Email format | Is there an email format validation rule, and what is the expected behaviour and message for a malformed email? | Boundary coverage, Section 5.1 |
| OQ-03 | Password rules | Are there password rules — minimum/maximum length, allowed characters, case sensitivity? Boundary values cannot be chosen without them. | Boundary coverage, Section 5.1 |
| OQ-04 | Lockout | Is there account lockout, rate limiting or CAPTCHA after repeated failures? After how many attempts, with what message and recovery path? | R-04, Section 4.2 |
| OQ-06 | Mandatory-field behaviour | How is REQ-03 enforced, and what should the user see — a client-side validation message, a disabled submit button, or the REQ-05 error? Is the message the same for email-empty, password-empty and both-empty? | TC-006, TC-007, TC-008 |
| OQ-07 | Environment | Which environment should be tested, and what is its URL if not `app.wingify.com`? | Section 7.1, R-04 |
| OQ-08 | Tooling | Which test management and defect tracking tools, and in which project? | Sections 10, 12 |
| OQ-09 | Schedule | What is the target release date and the available testing window? | Section 11 |
| OQ-10 | Dashboard definition | What specifically identifies "the authenticated dashboard" in REQ-04 — a URL, page title, or a particular element? | TC-002, R-05 |
| OQ-11 | Browser matrix | Which browsers, versions and operating systems are supported? | Section 7.1 |
| OQ-12 | Unauthenticated access | REQ-02 covers invalid credentials. What is the expected behaviour when the dashboard is requested with **no** credentials — redirect to login, or an error? | TC-009 |

> OQ-05 from TP-WGF-LOGIN-001 (whitespace-only input) is not carried into this plan: the 10-case
> limit in the CLEAR prompt left no room for it. It remains an open question on the earlier plan.

---

## 15. Approvals

| Role | Name | Decision | Date | Comments |
|---|---|---|---|---|
| QA Engineer (author) | Suman | Submitted for review | 2026-11-21 | |
| QA Lead / Owner | `<fill in>` | `<pending>` | | |
| Product / Requirement author | `<fill in>` | `<pending>` | | |
| Engineering lead | `<fill in>` | `<pending>` | | |

---

## Review Self-Check (per the CLEAR prompt)

| Check | Result |
|---|---|
| Every test case traces to a supplied requirement ID | Pass — see the coverage check in Section 6 |
| Exactly 10 test cases, all distinct | Pass — TC-001 to TC-010 |
| Expected results describe observable behaviour | Pass — all assertions are on displayed pages, text and access state |
| No case marked Passed or Failed | Pass — all 10 are "Not Run" |
| No real credentials anywhere | Pass — placeholders only |
| No invented validation message, password policy or lockout rule | Pass — each is an open question instead |
| Unknown behaviour identified and listed | Pass — TC-002, TC-006, TC-007, TC-008, TC-009 carry "Requires clarification"; all appear in Section 14 |
| Every `<fill in>` is a genuine missing input | Pass — environment, browsers, OS, resolution, network, tools, schedule dates, approvers |

---

## HUMAN REVIEW GATE

**I assumed:** the five requirements are the complete approved baseline, and that
`https://app.wingify.com/#/login` is the correct page under test.

**I could not confirm, and did not invent:** any IP or location access rule (OQ-01); email format,
password rules or case sensitivity — so **no length or complexity boundary values appear in this plan**;
lockout behaviour (OQ-04); the empty-field enforcement mechanism and message (OQ-06); what identifies
the authenticated dashboard (OQ-10); expected handling of unauthenticated access (OQ-12); and the
environment, tools, browser matrix and schedule.

**Open questions blocking sign-off:** OQ-01, OQ-06, OQ-07, OQ-10 and OQ-12 affect pass/fail criteria
directly. The rest block planning rather than execution.

**Approve, or edit, before test cases are exported or automation is written from this plan.**

# CLEAR

**Context:**
I am a QA engineer preparing to test the login page at https://app.wingify.com/#/login.
I need a functional **test plan** for the login module. For this exercise, the approved
requirements are:

- Registered users can log in with valid credentials.
- Invalid credentials must not grant access.
- Email and password are mandatory.
- Successful login opens the authenticated dashboard.
- Invalid login shows the error message "Your email, password, IP address or location did not match".

**Limits:**

- Use only the five requirements supplied above. Nothing else is approved behaviour.
- Produce exactly 10 test cases in the test scenarios section.
- Use placeholders for credentials (`<registered_email>`, `<valid_password>`); never include a real password.
- Do not invent validation messages, password policies, email format rules, lockout rules or session rules.
- Set the execution status of every test case to "Not Run".
- If an expected result depends on a missing requirement, mark it "Requires clarification"
  and list it in the open questions section.
- Where a planning detail was not supplied (environment, tools, schedule, approvers), write
  `<fill in>` instead of assuming a value. Label any QA proposal as "(Recommendation)".
- Every test case must trace to at least one requirement ID (REQ-01 to REQ-05).

**Examples:**
Use this filled example as the format for each test case row:

Test Case ID: WGF-LOGIN-TC-001
Requirement: REQ-01, REQ-04
Summary: Verify login with valid registered credentials
Preconditions: An active registered test account is available; the user is logged out.
Test Data: `<registered_email>`, `<valid_password>`
Steps:
1. Open https://app.wingify.com/#/login.
2. Enter the registered email.
3. Enter the valid password.
4. Submit the login form.
Expected Result: Login succeeds and the authenticated dashboard opens.
Priority: High
Test Type: Positive
Status: Not Run

Use this format for the plan header:

| Field | Value |
|---|---|
| Test Plan ID | TP-WGF-LOGIN-002 |
| Title | Functional Test Plan for the Wingify Login Module (CLEAR) |
| Status | DRAFT — pending human review |

**Action:**
Generate a functional test plan for the login module containing:

1. Plan header (ID, title, URL, version, author, date, status)
2. Approved requirements baseline, as REQ-01 to REQ-05
3. Objective
4. Scope — inclusions and exclusions
5. Test strategy and approach
6. Test scenarios — exactly 10 test cases as a Jira-style table with the columns:
   Test Case ID, Requirement, Summary, Preconditions, Test Data, Steps, Expected Result,
   Priority, Test Type, Status
7. Test environment and test data
8. Entry and exit criteria for test design, execution and closure
9. Test deliverables
10. Defect reporting procedure
11. Test schedule
12. Tools
13. Risks and mitigations
14. Open questions / requires clarification
15. Approvals

Cover valid login, incorrect password, unregistered email, empty email, empty password,
both fields empty, the exact error message text, and access control before and after login.
Write numbered steps and observable expected results.

**Review:**
Before returning the plan, check that:

- Every test case traces to a supplied requirement ID.
- There are exactly 10 test cases and they are distinct.
- Expected results describe observable behaviour, not internal state.
- No test case is marked Passed or Failed; all are "Not Run".
- No real credentials appear anywhere in the plan.
- No validation message, password policy or lockout rule has been invented.
- Unknown behaviour is clearly identified as "Requires clarification" and appears in the
  open questions section.
- Every `<fill in>` is a genuine missing input, not laziness.

Treat the test scenarios table as Jira-style. Exact import compatibility requires the Jira
project and the test-management app's field mapping.

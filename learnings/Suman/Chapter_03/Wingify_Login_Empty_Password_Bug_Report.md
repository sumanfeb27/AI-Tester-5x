# Bug Report: BUG-WGF-LOGIN-001

> **Hypothetical training example.** This defect was supplied as a training exercise. It is **not**
> a confirmed issue in Wingify and has not been verified against the live application.

| Field | Value |
|---|---|
| **Bug ID** | BUG-WGF-LOGIN-001 |
| **Module** | Login / Authentication |
| **Requirement violated** | Email and password are mandatory |
| **Reported by** | Suman — QA Engineer |
| **Date reported** | 2026-11-21 |
| **Severity (provisional)** | High |
| **Status** | New |

## 1. Title

Login form submits with an empty password and gives the user no validation feedback

## 2. Environment

| Attribute | Value |
|---|---|
| Application URL | https://app.wingify.com/#/login |
| Browser and version | Not supplied |
| Operating system | Not supplied |
| Application build / version | Not supplied |
| Execution date and time | Not supplied |

## 3. Preconditions

- The user is logged out, with no active session.
- An active registered test account is available.
- The login page has loaded.

## 4. Test Data

- Email: `<registered_email>`
- Password: left empty (no characters entered)

## 5. Steps to Reproduce

1. Open `https://app.wingify.com/#/login` while logged out.
2. Enter `<registered_email>` in the email field.
3. Leave the password field empty.
4. Submit the login form.
5. Observe the page and any feedback shown.

## 6. Expected Result

Per the mandatory-field requirement, submission should be blocked because the password is empty,
and the user should receive visible feedback that the password is required.

The requirements do not specify *how* this is enforced or what text is shown, so no specific
message is asserted here. **For the author:** confirm the enforcement mechanism and the exact text,
and whether it also applies to an empty email.

## 7. Actual Result

The form submits. No visible validation feedback appears, and the user remains on the login page
with no message indicating what went wrong.

## 8. Reproducibility

3 out of 3 attempts (100%).

## 9. Suggested Severity and Rationale

**Provisional: High.**

- The mandatory-field requirement is not enforced on submission.
- The user receives no feedback at all, so the login failure is silent and the user has no way to
  know what to correct.

Severity is **provisional**: with no environment details or logs, the scope is unconfirmed —
whether all browsers are affected, and whether the submission reaches the server.

## 10. Attachments

Not provided — no screenshots, video or logs were supplied.

## 11. Observed vs. Assumed

Reported facts vs. inference:

| # | Statement | Basis |
|---|---|---|
| 1 | The form submits with an empty password | **Observed** — supplied in the report |
| 2 | No visible validation feedback appears | **Observed** — supplied in the report |
| 3 | Reproducible 3 of 3 | **Observed** — supplied in the report |
| 4 | Submission should be blocked when the password is empty | **Requirement** — mandatory-field rule |
| 5 | The user *should* see a message naming the password as required | **Assumption** — no requirement defines the feedback mechanism or its text |
| 6 | The approved invalid-login message applies here | **Not assumed** — no requirement states that message covers an empty field |
| 7 | Whether the request reaches the server | **Unknown** — no logs supplied |
| 8 | Whether other browsers are affected | **Unknown** — environment not supplied |

**To confirm this report:** re-run the steps capturing browser and version, OS, build, timestamp,
a screenshot, and the console and network log for the submit action.

# CRISP

**Context:**
For a training exercise, assume I observed the following defect at https://app.wingify.com/#/login:

- Requirement: Email and password are mandatory.
- Starting state: The user is logged out and the login page has loaded.
- Action: Enter a registered test email, leave the password empty, and submit the login form.
- Observation: The form submits, but no visible validation feedback appears and the user stays on the login page with no message.
- Reproducibility: 3 out of 3 attempts.
- Browser/version, operating system, build, and execution time: Not supplied.
- Screenshots, video, and logs: Not supplied.

For reference, the approved requirements for this exercise are:

- Registered users can log in with valid credentials.
- Invalid credentials must not grant access.
- Email and password are mandatory.
- Successful login opens the authenticated dashboard.
- Invalid login shows the error message "Your email, password, IP address or location did not match".

This is a hypothetical defect, not a confirmed issue in Wingify.

**Role:**
Act as a senior QA engineer writing a clear, reproducible bug report.

**Instructions:**
Create a bug report with:

1. Title
2. Environment
3. Preconditions
4. Test Data
5. Steps to Reproduce
6. Expected Result
7. Actual Result
8. Reproducibility
9. Suggested Severity and rationale
10. Attachments

Base the expected result on the mandatory-password requirement. Do not invent the exact validation
text, and do not assume the REQ-05 error message is the expected feedback — no requirement says it
applies to an empty field. Distinguish observed behaviour from assumptions. Label severity as
provisional.

**Style:**
Use concise, factual language and numbered reproduction steps. Write for a developer who has not
seen the issue.

**Parameters:**

- Produce one bug report.
- Keep it under 500 words.
- Use placeholders for account details; never include a real password.
- Mark missing environment details as "Not supplied."
- Mark attachments as "Not provided."
- Clearly label the report "Hypothetical training example."

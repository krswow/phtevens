# Phtevens — Test Specification

## Overview
This document defines manual test cases for all requirements in REQUIREMENTS.md. Each test case references a requirement ID and must be executed and recorded as pass or fail.

Test cases marked with **"Not yet implemented"** in the Expected Result indicate that the related requirement has not yet been implemented. The "Not yet implemented" annotation must be removed only when the requirement is correctly implemented and the test case passes.

---

## Functional Requirements

### FR-01 — Betting Coupon Submission

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-01-TC-01 | FR-01 | Log in as a member. Navigate to submit coupon. Add 2 bets from different sports. Submit. | Coupon is saved and visible to the member. |
| FR-01-TC-02 | FR-01 | Log in as a member. Navigate to submit coupon. Submit without adding any bets. | Submission is rejected with an error message. |

### FR-02 — Minimum Odds

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-02-TC-01 | FR-02 | Log in as a member. Submit a coupon with two bets at odds 2.0 and 1.5 (total: 3.0). | Coupon is accepted and saved. |
| FR-02-TC-02 | FR-02 | Log in as a member. Submit a coupon with two bets at odds 1.2 and 1.3 (total: 1.56). | Submission is rejected with a message stating minimum odds of 1.75 are not met. |

### FR-03 — Stake Amount

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-03-TC-01 | FR-03 | Log in as a member. Submit a coupon. View the coupon details. | Coupon displays a stake of 25 DKK. |
| FR-03-TC-02 | FR-03 | Log in as a member. Navigate to submit coupon. Attempt to change the stake amount. | The stake field is not editable. |

### FR-04 — Coupon Result

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-04-TC-01 | FR-04 | Log in as administrator. Select a coupon where all bets are correct. Register result as won. | Coupon result is set to won. |
| FR-04-TC-02 | FR-04 | Log in as a member. Attempt to register the result of a coupon. | The result registration function is not available. |

### FR-05 — Winnings

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-05-TC-01 | FR-05 | Log in as a member. Submit a coupon with total odds of 3.0. View the coupon. | Potential winnings displayed as 75.00 DKK. |
| FR-05-TC-02 | FR-05 | Log in as a member. Submit a coupon with total odds of 1.75. View the coupon. | Potential winnings displayed as 43.75 DKK, not 25.00 DKK. |

### FR-06 — Standings

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-06-TC-01 | FR-06 | Register 2 won coupons for one member. View standings. | Member shows 2 wins and correct accumulated winnings, ranked above members with lower winnings. |
| FR-06-TC-02 | FR-06 | View standings with one member having no won coupons and another with won coupons. | Member with no winnings is ranked below the member with winnings. |

### FR-07 — Weekly Overview

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-07-TC-01 | FR-07 | Navigate to a past week where coupons were submitted. | All coupons submitted for that week are displayed. |
| FR-07-TC-02 | FR-07 | Navigate to a week where no coupons were submitted. | Overview shows no coupons for that week. |

### FR-08 — User Login

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-08-TC-01 | FR-08 | Navigate to the application. Enter valid username and password. Click login. | User is granted access to the application. **Not yet implemented.** |
| FR-08-TC-02 | FR-08 | Navigate to the application. Enter valid username and incorrect password. Click login. | Access is denied with an error message. **Not yet implemented.** |

### FR-09 — Member Permissions

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-09-TC-01 | FR-09 | Log in as a member. View the weekly overview. | All members' coupons are visible. **Not yet implemented.** |
| FR-09-TC-02 | FR-09 | Log in as a member. Attempt to submit a coupon on behalf of another member. | Submission is rejected. **Not yet implemented.** |

### FR-10 — Administrator Permissions

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| FR-10-TC-01 | FR-10 | Log in as administrator. Navigate to a coupon. Register the result. | Result is saved successfully. **Not yet implemented.** |
| FR-10-TC-02 | FR-10 | Log in as a member. Attempt to access the result registration function. | The function is not available to the member. **Not yet implemented.** |

---

## Non-Functional Requirements

### NFR-01 — Usability

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| NFR-01-TC-01 | NFR-01 | Open the application on a mobile device or browser at 375px width. Navigate all pages. | All content and functions are accessible and readable. **Not yet implemented.** |
| NFR-01-TC-02 | NFR-01 | Open the application on desktop. Resize the browser window to 375px width. | No content is cut off or inaccessible. **Not yet implemented.** |

### NFR-02 — Availability

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| NFR-02-TC-01 | NFR-02 | Access the application outside normal business hours (e.g. midnight). | Application loads and is fully functional. **Not yet implemented.** |
| NFR-02-TC-02 | NFR-02 | Access the application immediately after a new deployment is pushed. | Application remains available with no interruption. **Not yet implemented.** |

### NFR-03 — Data Integrity

| ID | Requirement | Steps | Expected Result |
|----|------------|-------|----------------|
| NFR-03-TC-01 | NFR-03 | Log in as a member. Edit the odds on a submitted coupon. Save. | Updated coupon is saved correctly. **Not yet implemented.** |
| NFR-03-TC-02 | NFR-03 | Log in as a member. Attempt to set the result of their own coupon to won. | Action is not permitted. **Not yet implemented.** |

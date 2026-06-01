# Phtevens — User Requirements

## Overview
A web application for Phtevens (7 members) to track weekly betting coupons, results, and standings.

## Members
- Marcus
- Leila
- Tobias
- Priya
- Finn
- Sofia
- Dante

---

## Functional Requirements

### FR-01 — Betting Coupon Submission
Each week, each member must be able to submit a betting coupon containing one or more sport bets from any sport.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member submits a coupon with 2 bets from different sports | Coupon is saved and visible to the member |
| - | Member attempts to submit a coupon with no bets | Submission is rejected with an error message |

### FR-02 — Minimum Odds
A betting coupon must have total odds of 1.75 or higher. Total odds is calculated as the product of the individual odds of all bets on the coupon.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member submits a coupon with total odds of 2.0 × 1.5 = 3.0 | Coupon is accepted |
| - | Member submits a coupon with total odds of 1.2 × 1.3 = 1.56 | Submission is rejected with a message stating minimum odds of 1.75 are not met |

### FR-03 — Stake Amount
Each betting coupon has a fixed stake of 25 DKK.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member submits a coupon | Coupon displays a stake of 25 DKK |
| - | Member attempts to change the stake amount | The stake field is not editable |

### FR-04 — Coupon Result
A betting coupon is considered won if all bets on the coupon are correct. If one or more bets are incorrect, the coupon is considered lost. Only an administrator can register the result of a coupon.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Administrator marks a coupon where all bets are correct as won | Coupon result is set to won |
| - | Member attempts to register the result of their own coupon | Action is not permitted |

### FR-05 — Winnings
The potential winnings for a coupon is calculated as the stake multiplied by the total odds (e.g. 25 DKK × 1.75 = 43.75 DKK).

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member submits a coupon with total odds of 3.0 | Potential winnings displayed as 75.00 DKK |
| - | Member submits a coupon with total odds of 1.75 | Potential winnings displayed as 43.75 DKK, not 25 DKK |

### FR-06 — Standings
Each member's standings must show number of won coupons, number of lost coupons, and accumulated winnings in DKK from won coupons. Members must be ranked in descending order by accumulated winnings.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Two coupons are registered as won for a member | Standings show 2 wins and accumulated winnings from both coupons |
| - | A member with no won coupons is compared to a member with won coupons | Member with no winnings is ranked below the member with winnings |

### FR-07 — Weekly Overview
It must be possible to view all submitted betting coupons for any past or current week.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | User navigates to a past week with submitted coupons | All coupons for that week are displayed |
| - | User navigates to a week with no submitted coupons | Overview shows no coupons for that week |

### FR-08 — User Login
Access to the application requires login with a username and password.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | User enters valid username and password | User is granted access to the application |
| - | User enters incorrect password | Access is denied with an error message |

### FR-09 — Member Permissions
A member can only view and submit their own betting coupons.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member views the weekly overview | Only their own coupons are visible |
| - | Member attempts to access another member's coupon directly | Access is denied |

### FR-10 — Administrator Permissions
Only an administrator can register the result of a betting coupon.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Administrator logs in and registers a coupon result | Result is saved successfully |
| - | Member attempts to access the result registration function | The function is not available to the member |

---

## Non-Functional Requirements

### NFR-01 — Usability
The application must be usable on both desktop and mobile devices.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | User opens the application on a mobile device (375px width) | All content and functions are accessible and readable |
| - | User opens the application on a desktop and resizes to mobile width | No content is cut off or hidden |

### NFR-02 — Availability
The application must be available at all times without scheduled downtime.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | User accesses the application outside business hours | Application loads and is fully functional |
| - | User attempts to access the application during a deployment | Application remains available with no interruption |

### NFR-03 — Data Integrity
A member can edit their own betting coupon after submission. Only an administrator can determine whether a coupon is a win or a loss.

| | Test Case | Expected Result |
|-|-----------|----------------|
| + | Member edits the odds on a submitted coupon | Updated coupon is saved correctly |
| - | Member attempts to set the result of their own coupon to won | Action is not permitted |

---

## Process

All new features must follow this workflow:
1. Add to this document as a planned feature
2. Create a GitHub Issue with acceptance criteria
3. Implement in a branch named `feature/issue-<number>-short-description`
4. Push and merge via Pull Request referencing the issue

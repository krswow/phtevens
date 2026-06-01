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

### UR-01 — Betting Coupon Submission
Each week, each member must be able to submit a betting coupon containing one or more sport bets from any sport.

### UR-02 — Minimum Odds
A betting coupon must have total odds of 1.75 or higher. Total odds is calculated as the product of the individual odds of all bets on the coupon.

### UR-03 — Stake Amount
Each betting coupon has a fixed stake of 25 DKK.

### UR-04 — Coupon Result
A betting coupon is considered won if all bets on the coupon are correct. If one or more bets are incorrect, the coupon is considered lost. Only an administrator can register the result of a coupon.

### UR-05 — Winnings
The potential winnings for a coupon is calculated as the stake multiplied by the total odds (e.g. 25 DKK × 1.75 = 43.75 DKK).

### UR-06 — Standings
Each member's standings must show:
- Number of won coupons
- Number of lost coupons
- Accumulated winnings in DKK from won coupons

Members must be ranked in descending order by accumulated winnings.

### UR-07 — Weekly Overview
It must be possible to view all submitted betting coupons for any past or current week.

### UR-08 — User Login
Access to the application requires login with a username and password.

### UR-09 — Member Permissions
A member can only view and submit their own betting coupons.

### UR-10 — Administrator Permissions
Only an administrator can register the result of a betting coupon.

---

## Non-Functional Requirements

### UR-11 — Usability
The application must be usable on both desktop and mobile devices.

### UR-12 — Availability
The application must be available at all times without scheduled downtime.

### UR-13 — Data Integrity
A member can edit their own betting coupon after submission. Only an administrator can determine whether a coupon is a win or a loss.

---

## Planned Features (Backlog)

| ID | Feature | Priority |
|----|---------|----------|
| F-01 | Member profile pages | Medium |
| F-02 | Bet history chart per member | Medium |
| F-03 | Weekly summary / best performer highlight | Medium |

---

## Process

All new features must follow this workflow:
1. Add to this document as a planned feature
2. Create a GitHub Issue with acceptance criteria
3. Implement in a branch named `feature/issue-<number>-short-description`
4. Push and merge via Pull Request referencing the issue

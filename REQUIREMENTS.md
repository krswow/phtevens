# Phtevens FC — User Requirements

## Overview
A web application for the Phtevens football betting club (7 members) to track weekly bets, results, and standings.

## Members
- Marcus
- Leila
- Tobias
- Priya
- Finn
- Sofia
- Dante

---

## Core Requirements

### UR-01 — Weekly Bets
Members can log a bet for a football match each week, including:
- The match (e.g. Arsenal vs Chelsea)
- Their prediction (e.g. Arsenal win)
- The result (win / loss / pending)

### UR-02 — Leaderboard
The app displays a ranked leaderboard of all members based on their points (wins and losses).

### UR-03 — Week Navigation
Users can browse bets from previous and future weeks using prev/next navigation.

---

## Planned Features (Backlog)

These are candidates for future GitHub Issues:

| ID | Feature | Priority |
|----|---------|----------|
| F-01 | Member profile pages | Medium |
| F-02 | Edit or delete a bet | High |
| F-03 | Bet history chart per member | Medium |
| F-04 | Custom stake amounts per bet | Low |
| F-05 | Weekly summary / best performer highlight | Medium |
| F-06 | Admin mode to lock results | Low |

---

## Process

All new features must follow this workflow:
1. Add to this document as a planned feature
2. Create a GitHub Issue with acceptance criteria
3. Implement in a branch named `feature/issue-<number>-short-description`
4. Push and merge via Pull Request referencing the issue

# Commitment Contracts: Case Studies & Lessons

## Overview
Commitment contracts are agreements where you put something at stake (usually money) to incentivize goal completion. The behavioral economics principle: **loss aversion is 2x stronger than gain motivation**.

---

## StickK (2008 - Present)

### What It Is
- Founded by Yale economists (including Dean Karlan)
- Users create "Commitment Contracts" with stakes
- Money goes to charity, anti-charity, or a friend if you fail
- Uses "referees" (humans) to verify completion

### Model
- Free to use with no stakes
- Optional financial stakes ($5-$500+)
- Anti-charity option (money to cause you hate) increases motivation

### Why It Plateaued
1. **No upside for winners** — You only avoid loss, never gain
2. **Honor system** — Relies on user self-reporting or human referees
3. **Single-player** — No community, no social accountability
4. **Web1 UX** — Clunky, dated interface
5. **No automation** — Manual verification, manual tracking

### Lessons for GoalStake
- ✅ Financial stakes work (proven over 15+ years)
- ❌ Need winner upside (GoalStake: loser pool → winners)
- ❌ Need automated verification (GoalStake: Chainlink oracles)
- ❌ Need community/social (GoalStake: shared goals, leaderboards)

---

## Beeminder (2011 - Present)

### What It Is
- "Quantified Self + Commitment Contracts"
- Heavy focus on data tracking and graphs
- Integrates with 30+ services (Fitbit, Strava, RescueTime, etc.)
- "Bright Red Line" shows your commitment trajectory

### Model
- Money goes to Beeminder (they keep it)
- Escalating pledges ($0 → $5 → $10 → $30 → $90 → $270 → $810)
- Premium tiers for advanced features

### Why It Stays Niche
1. **Steep learning curve** — Complex graphs, lots of configuration
2. **Nerds only** — Appeals to quantified-self data freaks
3. **All stick, no carrot** — No way to win money, only lose it
4. **No social** — Primarily solo experience
5. **Revenue model = user failure** — Perverse incentive alignment

### Strengths
- Excellent integrations with fitness trackers
- Sophisticated data visualization
- Loyal, cult-like user base
- 13+ years of operation = proven demand

### Lessons for GoalStake
- ✅ Integrations are key (automate data collection)
- ✅ Escalating stakes increase commitment
- ❌ Simplify UX (GoalStake: join a goal, stake, done)
- ❌ Add winner upside (GoalStake: earn from losers)
- ❌ Align incentives (GoalStake: yield revenue, not user failure)

---

## Pact / GymPact (2011 - 2017) — FAILED

### What It Is
- Mobile app for fitness stakes
- GPS-verified gym check-ins
- Users who hit goals earn from users who don't
- Winner-takes-from-losers model (similar to GoalStake)

### Why It Failed

1. **Gaming & Fraud**
   - Users spoofed GPS locations
   - Fake gym check-ins
   - Created fake accounts to game payouts

2. **Unit Economics**
   - Too many winners, not enough losers
   - Small pot = tiny payouts ($0.30-$2/week)
   - Not motivating enough to retain users

3. **Payment Issues**
   - Users complained about being charged incorrectly
   - Difficult to cancel/pause
   - Customer service nightmare

4. **Single Vertical**
   - Only gym visits (expanded to food logging, but awkwardly)
   - Couldn't grow beyond fitness enthusiasts

### Post-Mortem Quote (Beeminder)
> "We're genuinely sad about that but were very touched that they endorsed us in their announcement to their users."

### Lessons for GoalStake
- ⚠️ GPS/check-in verification is gameable
- ⚠️ Need robust fraud prevention
- ⚠️ Payouts must be meaningful (not $0.30)
- ✅ Winner-takes-from-losers model has demand
- ✅ GoalStake advantage: Strava API is harder to spoof than GPS
- ✅ GoalStake advantage: Chainlink verification is transparent

---

## DietBet / WayBetter (2012 - Present)

### What It Is
- Weight loss betting pools
- Groups bet on losing 4% body weight in 4 weeks
- Winners split the pot (minus platform fee)
- Expanded to general wellness challenges

### Model
- $25-$100+ entry fee
- Platform takes ~25% of pot
- Photo verification (before/after weigh-ins)

### Why It Works
- **Social accountability** — Groups compete together
- **Meaningful stakes** — Pot can be $10,000+
- **Clear metric** — Weight is objective (with verification)
- **Time-bound** — 4-week sprints create urgency

### Why It's Limited
- Single vertical (weight loss)
- Photo verification is clunky
- High platform fee (25%)
- No crypto integration (limited to US payments)

### Lessons for GoalStake
- ✅ Group/pool model increases engagement
- ✅ Meaningful pot sizes matter
- ❌ Lower platform fee (GoalStake: 0% from stakes)
- ❌ Expand beyond single vertical
- ❌ Automate verification (no photos)

---

## Key Takeaways for GoalStake

### What Works
1. Financial stakes dramatically increase completion rates
2. Loss aversion is real and powerful
3. Integrations with fitness trackers reduce friction
4. Group/social dynamics amplify motivation
5. Clear, objective metrics prevent disputes

### What Fails
1. Honor systems get gamed
2. Tiny payouts don't motivate
3. Complex UX limits adoption to nerds
4. Platform revenue from user failure = perverse incentives
5. Single-vertical limits growth

### GoalStake Advantages
| Problem | GoalStake Solution |
|---------|-------------------|
| Honor system | Chainlink oracle verification |
| No winner upside | Loser pool → winners |
| Perverse incentives | Yield on TVL (not failure fees) |
| Complex UX | Join a goal, stake, done |
| Single vertical | Any verifiable data source |
| Centralized custody | On-chain, transparent |

---

## Further Reading
- [Beeminder Competitors List](https://blog.beeminder.com/competitors)
- [Beeminder on Pact Shutdown](https://blog.beeminder.com/pact)
- [StickK Research Papers](https://www.stickk.com/research)
- Book: "Nudge" by Richard Thaler
- Book: "Thinking, Fast and Slow" by Daniel Kahneman

# Vaada Goal Strategy

*How to structure goals for global scale while keeping it simple.*

---

## Core Principles

1. **Fairness** — Everyone gets the same relative time to complete goals
2. **Simplicity** — Easy to understand, easy to join
3. **Liquidity** — Bigger pools = more stakes = more motivation
4. **Urgency** — Deadlines create commitment

---

## Regional Structure

### Daily Goals → 4 Regional Pools

| Region | Timezone | Entry Window | Deadline |
|--------|----------|--------------|----------|
| Americas-East | EST | 6am - 12pm | 10pm EST |
| Americas-West | PST | 6am - 12pm | 10pm PST |
| Europe | CET | 6am - 12pm | 10pm CET |
| Asia-Pacific | JST | 6am - 12pm | 10pm JST |

**Why 4 regions:**
- Americas split because 3-hour EST/PST gap matters for daily goals
- Europe consolidated (UK/CET close enough)
- Asia-Pacific consolidated (JST anchor, covers AU morning)

**Entry Window (6am - 12pm):**
- Catches morning committers
- Closes at lunch = commitment checkpoint
- Prevents "already hit my goal" gaming
- 6 hours is enough time for anyone to join

**Deadline (10pm):**
- Full day to complete goal
- Not too late (people are awake)
- Last-minute joiners (noon) have 10 hours

### Weekly/Monthly Goals → 1 Global Pool

| Goal Type | Entry Window | Deadline |
|-----------|--------------|----------|
| Weekly | Mon 12am - Wed 12pm UTC | Sun 11:59pm UTC |
| Monthly | 1st - 7th of month | Last day 11:59pm UTC |

**Why global:**
- Over 7+ days, a few hours timezone difference doesn't matter
- Bigger pool = more participants = more exciting
- UTC is neutral standard

---

## Goal Types

### Phase 1: Fitness (Now)

| Goal | Target | Tracker | Appeal |
|------|--------|---------|--------|
| **5K Steps** | 5,000 steps | Fitbit | Low barrier, everyone walks |
| **10K Steps** | 10,000 steps | Fitbit | Health-conscious |
| **Daily 3 Miles** | 3 miles | Strava | Runners |
| **Daily 5 Miles** | 5 miles | Strava | Serious runners |

**Recommended stakes:** $1-10 USDC (testnet), $5-50 USDC (mainnet)

### Phase 2: Wellness (Q2 2026)

| Goal | Target | Tracker | Notes |
|------|--------|---------|-------|
| **7hr Sleep** | 7+ hours | Fitbit Sleep | Already have Fitbit |
| **Weight Loss** | X lbs/week | Withings | Requires scale |
| **Meditation** | 10 min/day | Headspace | API available |

### Phase 3: Productivity (Q3 2026)

| Goal | Target | Tracker | Notes |
|------|--------|---------|-------|
| **Screen Time** | < 2hr social | RescueTime | Have endpoints |
| **Deep Work** | 4hr focused | RescueTime | Have endpoints |
| **Learning** | 30 XP/day | Duolingo | Easy API |

---

## Verification Rules

### What Counts
- All activity for the calendar day (in user's timezone)
- Device-recorded data only (no manual entries)
- Data from connected tracker at time of settlement

### Anti-Gaming
- Entry deadline prevents "already won" joins
- `manual: false` filter on Strava activities
- Fitbit data is device-recorded by default

### Settlement
- **MVP:** Manual verification via `cast` commands
- **Beta:** Backend cron job auto-settles after deadline
- **Mainnet:** Chainlink Functions for trustless verification

---

## Pool Economics

### Minimum Viable Pool
- **3 participants** — enough for competition
- **$15 total stake** — meaningful but low risk

### Optimal Pool
- **10-50 participants** — good social proof
- **$100-500 total stake** — exciting payouts

### Scaling Concern
- Too many pools = fragmented liquidity
- Start with fewer pools, split when demand proves it

---

## Implementation Phases

### Phase 1: Friends Beta (Now)
```
- 1 region: Americas-East (EST)
- 1 goal type: 5K Steps (Fitbit)
- Manual settlement
- Target: 10 users
```

### Phase 2: Public Beta (Q1 2026)
```
- 4 regions: Americas-East, Americas-West, Europe, Asia-Pacific
- 2 goal types: Steps + Miles
- Backend auto-settlement
- Target: 100 users
```

### Phase 3: Mainnet Launch (Q2 2026)
```
- 4 regions
- 5+ goal types (steps, miles, sleep, weight, meditation)
- Chainlink verification
- Target: 1,000 users
```

### Phase 4: Scale (Q3+ 2026)
```
- Weekly/monthly global challenges
- Custom goals (user-created)
- Team/group challenges
- Target: 10,000+ users
```

---

## Display Strategy

### Backend
- Store all times as **Unix timestamps (UTC)**

### Frontend
- Display in **user's local timezone**
- Show countdown: "Ends in 4h 32m"
- Show local time: "Deadline: 10:00 PM"

### Goal Cards
```
🏃 Daily 5K Steps
Americas-East

Entry closes: 12:00 PM (in 2h 15m)
Deadline: 10:00 PM tonight

$1 - $10 USDC
12 participants | $45 staked
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Daily regions | 4 pools | Balance fairness vs liquidity |
| Entry window | 6am-12pm | Morning commitment, prevents gaming |
| Deadline | 10pm local | Full day, not too late |
| Weekly/monthly | Global (UTC) | Timezone doesn't matter over 7+ days |
| Step counting | All day counts | Simpler, morning exercisers included |

---

## Open Questions

1. **Should Americas be 1 or 2 pools?**
   - Current: 2 (East/West)
   - Alternative: 1 with EST anchor (PST ends at 9pm)
   - Decision: Start with 2, merge if pools are too small

2. **Weekend-specific goals?**
   - "Weekend Warrior" — Sat+Sun combined
   - Could be global pool (less time-sensitive)

3. **Streak bonuses?**
   - Complete 7 days in a row → bonus from fee pool?
   - Adds complexity, consider for v2

---

*Last updated: 2026-02-13*

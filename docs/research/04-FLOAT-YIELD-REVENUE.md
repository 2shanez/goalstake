# Float & Yield Revenue Models: Case Studies

## Overview
"Free for users, monetize the float" — companies that make money from interest on customer deposits while offering free or low-cost services.

---

## Robinhood

### Model
- Commission-free stock trading
- Makes money from:
  1. **Payment for order flow** (PFOF) — selling order data to market makers
  2. **Interest on uninvested cash** — ~5% on billions in deposits
  3. **Robinhood Gold** — premium subscription
  4. **Stock lending** — lending customer shares to short sellers
  5. **Margin interest** — loans to customers

### Revenue Breakdown (2023)
| Source | Revenue |
|--------|---------|
| Net interest | ~$1B (40%+) |
| PFOF | ~$500M |
| Gold subscriptions | ~$300M |
| Other | ~$200M |

### Lessons
- "Free" trading wasn't free — users paid in spread
- Interest income exploded when rates rose
- Float is massive revenue at scale
- Controversy: Robinhood benefits from customers NOT investing (cash earns interest)

---

## Cash App (Block/Square)

### Model
- Free P2P payments
- Makes money from:
  1. **Bitcoin trading fees** — spread on BTC buy/sell
  2. **Cash Card interchange** — merchant fees when you spend
  3. **Interest on deposits** — float before users spend
  4. **Business payments** — fees from merchants

### Growth Strategy
1. Free P2P payments (Venmo competitor)
2. Add Cash Card (debit card) — earns interchange
3. Add Bitcoin — earns trading spread
4. Add direct deposit — increases float
5. Add tax filing — captures more of financial life

### Lesson
- Give away the hook (P2P), monetize the ecosystem
- More money in account = more float = more revenue
- Adjacent products compound value

---

## PayPal / Venmo

### Model
- PayPal charges merchants 2.9% + $0.30
- Venmo: free P2P, charges for instant transfer
- **Float**: Billions in customer balances earn interest for PayPal
- PayPal Savings now offers 4% APY (they earn spread)

### Scale of Float
- PayPal holds ~$35B+ in customer funds
- Even at 1% spread = $350M/year in pure float revenue

---

## Traditional Examples

### Insurance Companies
- Collect premiums upfront
- Invest float until claims are paid
- Warren Buffett: "Float is money we hold that isn't ours"
- Berkshire's insurance float: ~$160B

### Banks
- Deposits earn <1% for customers
- Banks lend at 5-10%
- Net interest margin = profit

---

## Crypto DeFi Yield Sources

### Where GoalStake Float Could Earn

| Protocol | Type | APY (varies) |
|----------|------|--------------|
| Aave | Lending | 3-8% |
| Compound | Lending | 2-6% |
| MakerDAO (DSR) | Savings | 5-8% |
| Lido | Staking (ETH) | 3-4% |
| Morpho | Optimized lending | 4-10% |
| Yearn | Yield aggregator | Variable |

### USDC-Specific
- Circle/Coinbase invest USDC reserves
- Partners (like exchanges) earn yield share
- Base Sepolia: test USDC doesn't earn real yield

### Risk Considerations
- Smart contract risk (protocol hacks)
- Liquidity risk (can't withdraw during demand)
- Regulatory risk (DeFi protocols face scrutiny)
- APY fluctuates with market conditions

---

## GoalStake Float Economics

### Assumptions
| TVL | Avg Lock | Yield | Annual Revenue |
|-----|----------|-------|----------------|
| $100K | 30 days | 5% | $5K |
| $1M | 30 days | 5% | $50K |
| $10M | 30 days | 5% | $500K |
| $100M | 30 days | 5% | $5M |

### Reality Check
- Early: Float revenue is tiny
- Scale: Becomes meaningful at $10M+ TVL
- Variance: Yield rates change with market
- Ops: Need to actively manage yield positions

### Alternative Revenue (At Scale)
| Source | Description |
|--------|-------------|
| Yield on TVL | Core model |
| Premium features | Analytics, custom goals |
| B2B | Corporate wellness, creator tools |
| Sponsored challenges | Brands fund prize pools |
| Data/API | Fitness insights platform |

---

## STEPN: A Cautionary Tale

### What It Was
- "Move-to-earn" — walk/run to earn tokens
- Buy NFT sneakers, earn GST/GMT tokens
- Massive growth in 2022: millions of users

### Why It Failed
1. **Inflationary tokenomics**
   - New tokens minted to pay runners
   - Token value collapsed
   - "Ponzi dynamics" — needed new buyers

2. **Not sustainable**
   - Revenue came from new user NFT purchases
   - When growth slowed, payouts collapsed
   - Classic pyramid structure

3. **No real revenue**
   - No float, no yield
   - Only revenue was secondary market fees
   - Couldn't survive bear market

### Lesson for GoalStake
- **Zero-sum > inflationary**
- GoalStake: Losers fund winners (no new tokens created)
- Yield comes from real DeFi, not token printing
- Sustainable even if user growth slows

---

## Key Principles

### Why Float Works
1. **Time value of money** — Money today > money tomorrow
2. **Aggregation** — Small balances × many users = large float
3. **Duration** — Longer locks = more yield earned
4. **Trust** — Users leave money in convenient platforms

### Risks
1. **Rate risk** — Yield rates can drop
2. **Liquidity mismatch** — Sudden withdrawals vs. locked positions
3. **Regulatory** — May need money transmitter license
4. **Operational** — Managing yield is work

### GoalStake Advantages
1. **Time-locked by design** — Stakes locked until deadline
2. **USDC stability** — No crypto volatility
3. **Transparent** — On-chain yield positions visible
4. **Aligned incentives** — Platform benefits from bigger/longer stakes

---

## Implementation Notes

### MVP (Current)
- No yield integration (stakes sit in contract)
- Revenue: $0
- Priority: Product-market fit first

### V2 (After $100K TVL)
- Integrate Aave or Morpho
- Auto-deposit stakes into yield
- Track yield accrual per stake

### V3 (After $1M TVL)
- Diversify yield sources
- Yield optimizer integration
- Treasury management

---

## Further Reading
- [Robinhood S-1 Filing](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001783879)
- [Float economics explanation](https://www.investopedia.com/terms/f/float.asp)
- [Aave Documentation](https://docs.aave.com/)
- [DeFi Yield Farming Guide](https://defillama.com/)

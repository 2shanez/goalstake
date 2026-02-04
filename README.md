# Vaada

**Stake Your Promise.**

The commitment market. Stake money on your goals, keep your promise → keep your stake + earn from those who don't.

🔗 **Live:** [vaada.io](https://vaada.io) (Base Sepolia testnet)

---

## What is Vaada?

Vaada (Hindi for "promise") is a protocol where users stake USDC on personal commitments. Chainlink oracles verify progress automatically, and smart contracts handle settlement — no human referees, no disputes.

**Polymarket** is where you bet on the world. **Vaada** is where you bet on yourself.

---

## How It Works

```
1. Pick a goal    → "Run 5 miles this week"
2. Stake USDC     → $10 - $100
3. Connect Strava → Auto-verification enabled  
4. Deadline hits  → Chainlink verifies your activity
5. Results:
   ✅ Success → Keep stake + share of loser pool
   ❌ Fail    → Stake redistributed to winners
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Chain** | Base (Coinbase L2) |
| **Contracts** | Solidity + Foundry |
| **Oracles** | Chainlink Functions + Automation |
| **Frontend** | Next.js 14, React, Tailwind CSS |
| **Auth** | Privy (email/Google/wallet) |
| **Verification** | Strava API |

---

## Project Structure

```
vaada/
├── contracts/          # Solidity smart contracts
│   ├── src/
│   │   ├── GoalStakeV3.sol           # Core protocol
│   │   └── GoalStakeAutomationV3.sol # Chainlink integration
│   └── script/         # Deploy scripts
├── frontend/           # Next.js app
│   ├── src/
│   │   ├── app/        # Pages & API routes
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities, hooks, ABIs
└── docs/               # Documentation
```

---

## Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| GoalStakeV3 | `0x13b8eaEb7F7927527CE1fe7A600f05e61736d217` |
| GoalStakeAutomationV3 | `0xB10fCE97fc6eE84ff7772Bc44A651Dd076F7180D` |
| USDC (testnet) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

---

## Features

- ✅ Stake USDC on goals (entry windows, stake ranges)
- ✅ Strava OAuth integration
- ✅ Chainlink Functions for off-chain verification
- ✅ Chainlink Automation for deadline triggers
- ✅ Stake-weighted payout distribution
- ✅ Privy auth (email/Google/wallet)
- 🔄 E2E verification flow (in progress)
- ⏳ Mainnet deployment (coming soon)

---

## Local Development

### Prerequisites

- Node.js 18+
- Foundry
- pnpm (or npm/yarn)

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Contracts

```bash
cd contracts
forge build
forge test
```

---

## Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
```

---

## License

MIT

---

*Built by [Shane Sarin](https://2667.io) with Alfred 🎩*

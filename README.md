# Stellar Micro Crowdfunding dApp

## Description
Stellar Micro Crowdfunding is a production-style mini-dApp on Stellar Testnet.  
Users connect a Freighter wallet, submit donations through a Soroban smart contract, and track campaign progress in a polished web UI.

## Tech Stack
- Soroban smart contract (`Rust`)
- Next.js App Router (`TypeScript`)
- TailwindCSS
- Freighter wallet integration
- React Query for caching
- Contract tests (`cargo test`)
- Frontend tests (`Vitest` + `Testing Library`)

## Features
- Wallet connect flow (Freighter)
- Donate on-chain with Soroban contract call
- Campaign total and goal progress bar
- Donation event emission in contract
- Loading, pending, success, and error UX states
- Disabled actions during transaction signing/submission
- Transaction hash link to Stellar Expert
- Cached campaign reads with invalidation after donation

## Setup Instructions (Step-by-Step)

### Step 1: Prerequisites
Install the following tools:
- `Node.js` 20+
- `pnpm` 9+
- `Rust` + `cargo`
- Soroban CLI (for contract build/deploy)
- Freighter wallet browser extension

### Step 2: Install dependencies
From the project root:

```bash
pnpm install --dir frontend
```

Rust dependencies are resolved automatically when running `cargo build` / `cargo test`.

### Step 3: Configure environment variables
Copy the template and edit values:

```bash
cp .env.example frontend/.env.local
```

Set at minimum:
- `NEXT_PUBLIC_CONTRACT_ID` (after contract deployment)
- `NEXT_PUBLIC_SOROBAN_RPC_URL`
- `NEXT_PUBLIC_HORIZON_URL`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`
- `NEXT_PUBLIC_CAMPAIGN_GOAL`

### Step 4: Run the frontend locally

```bash
pnpm --dir frontend dev
```

Open: `http://localhost:3000`

### Step 5: Connect wallet and interact
1. Open Freighter and switch to **Testnet**
2. Click **Connect Freighter** in the app
3. Enter donation amount
4. Click **Donate**
5. Sign transaction in Freighter
6. Confirm updated total/progress and tx explorer link

## Smart Contract
Contract source: `contracts/src/lib.rs`

### Functions
- `initialize(owner, goal)`  
  Initializes campaign owner, goal, total (`0`), donor map, and initialization flag.
- `donate(donor, amount)`  
  Requires donor auth, validates positive amount, performs checked math, updates state, emits donation event.
- `total_raised()`  
  Returns cumulative donated amount.
- `campaign_goal()`  
  Returns configured campaign goal.
- `donor_total(donor)`  
  Returns total donated by a specific donor.

### Data Model
- `Initialized`: campaign guard flag
- `Owner`: campaign owner address
- `Goal`: target fundraising amount
- `Total`: total raised amount
- `Donors`: map of `Address -> i128`

## Tests

### Run smart contract tests

```bash
cargo test --manifest-path contracts/Cargo.toml
```

### Run frontend tests

```bash
pnpm --dir frontend test
```

### Optional production build check

```bash
pnpm --dir frontend build
```

### Screenshot placeholder
Add your test run screenshot at:

`docs/test-results-screenshot.png`

## Deployment

### A) Deploy the smart contract (Stellar Testnet)
1. Build contract WASM from `contracts/`
2. Deploy contract using Soroban CLI to Testnet
3. Save deployed contract ID
4. Set `NEXT_PUBLIC_CONTRACT_ID` in `frontend/.env.local`

### B) Deploy the frontend (Vercel or Netlify)
1. Import repository into your hosting provider
2. Set project root to `frontend`
3. Add env vars from `.env.example`
4. Deploy
5. Verify wallet connect and donation flow in production

## Live Demo
- Live URL: `https://YOUR-DEPLOYED-URL`

## Demo Video
- Video link: `https://YOUR-DEMO-VIDEO-LINK`

## Demo Script (1 Minute)
1. **Intro (0:00-0:10):**  
   “This is Stellar Micro Crowdfunding, a Soroban dApp on Stellar Testnet.”
2. **Connect wallet (0:10-0:20):**  
   Click **Connect Freighter** and show connected address.
3. **Make donation (0:20-0:35):**  
   Enter amount, click **Donate**, sign transaction in Freighter.
4. **Show state update (0:35-0:50):**  
   Show updated total raised, progress bar, and tx hash link.
5. **Show tests (0:50-1:00):**  
   Run contract and frontend tests in terminal.

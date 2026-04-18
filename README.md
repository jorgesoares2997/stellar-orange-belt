# 🟠 Stellar Orange Belt - Micro Crowdfunding dApp

## 🚀 Overview

Stellar Orange Belt is a premium, high-fidelity micro-crowdfunding dApp built on the Stellar Testnet. It demonstrates a full-stack Soroban integration with a modern, glassmorphic UI, multi-wallet support, and robust smart contract logic.

---

## ✨ Features

* **Premium UI Overhaul**: Futuristic "Orange Belt" aesthetic with glassmorphism, solar gradients, and smooth Framer Motion animations.
* **Multi-Wallet Support**: Integrated via `Stellar Wallets Kit` (Freighter, Albedo, xBull, Hana).
* **On-Chain Crowdfunding**: Powered by a Soroban smart contract with real-time state tracking.
* **Interactive Dashboard**: Shimmer-effect progress bars, real-time donation updates, and transaction explorer links.
* **Robust Security**: Checked arithmetic and authorization guards in the smart contract.

---

## 🛠️ Tech Stack

* **Smart Contract**: Rust + Soroban SDK
* **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4
* **State Management**: React Query (TanStack)
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Wallet Connection**: @creit.tech/stellar-wallets-kit

---
## 🌐 Screenshot with test output
👉 [Test output](docs/test-results.png)

## 🌐 Live Demo

👉 [https://stellar-orange-belt-nine.vercel.app/](https://stellar-orange-belt-nine.vercel.app/)

---

## 🎥 Demo Video (1 Minute)

👉 [https://youtu.be/lwT8X_11zT8](https://youtu.be/lwT8X_11zT8)

---

## 🧪 Requirements Check

* [x] **Mini-dApp fully functional**: Redesigned UI, functional donation flow, and multi-wallet integration.
* [x] **3+ Tests Passing**: Verified with `cargo test` (3 contract tests passing).
* [x] **3+ Meaningful Commits**: Structured into logical phases (UI, Wallet, Build Fixes).
* [x] **README Complete**: Documentation of features, setup, deployment, and demo.

---

## 🏃 Setup Instructions

### 1. Prerequisites

* Node.js 20+
* pnpm 10+
* Rust + cargo
* Soroban CLI

### 2. Install Dependencies

```bash
pnpm install
```

---

### 3. Environment Configuration

Copy the root `.env` to `frontend/.env` and update your Contract ID:

```bash
cp .env frontend/.env
```

Update:

```bash
NEXT_PUBLIC_CONTRACT_ID
```

---

### 4. Run Development Server

```bash
pnpm run dev
```

Open:

```
http://localhost:3000
```

---

## 🏗️ Smart Contract & Testing

### Run Contract Tests

```bash
cd contracts
cargo test
```

**Results:**

* donate_success_updates_total ... ok
* multiple_donors_accumulate_state ... ok
* reject_invalid_donation_amount ... ok

---

### Build Contract

```bash
cd contracts
stellar contract build
```

---

## 🚀 Deployment Guide

### A. Deploy Smart Contract

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/micro_crowdfunding.wasm \
  --source deployer \
  --network testnet
```

---

### B. Initialize Campaign

```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- initialize --owner deployer --goal 1000
```

---

## 🎬 Demo Flow (1 Minute Video)

1. **Intro (0–10s)**
   Stellar Orange Belt overview

2. **Wallet Connect (10–20s)**
   Multi-wallet connection (Freighter / Albedo / xBull / Hana)

3. **Donation Flow (20–40s)**
   Execute donation and sign transaction

4. **UI Update (40–50s)**
   Progress bar updates + transaction confirmation

5. **Validation (50–60s)**
   Show Rust tests passing

---

## 📄 Notes

This project was built as part of a Stellar Soroban bootcamp submission demonstrating end-to-end dApp development, including smart contracts, frontend integration, testing, and deployment.

---

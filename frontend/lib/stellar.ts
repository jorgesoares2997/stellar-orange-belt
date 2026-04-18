"use client";

import {
  Address,
  Account,
  Contract,
  rpc,
  scValToNative,
  nativeToScVal,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { HanaModule } from "@creit.tech/stellar-wallets-kit/modules/hana";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { config } from "@/lib/config";
import type { CampaignState, Donation } from "@/lib/types";
import { fallbackCampaignState } from "@/lib/mock-data";

// Singleton-like initialization for the wallet kit
let kitInitialized = false;

function ensureKit() {
  if (typeof window !== "undefined" && !kitInitialized) {
    StellarWalletsKit.init({
      network: config.networkPassphrase as Networks,
      modules: [
        new FreighterModule(),
        new AlbedoModule(),
        new xBullModule(),
        new HanaModule(),
      ],
    });
    kitInitialized = true;
  }
}

const server = new rpc.Server(config.rpcUrl, { allowHttp: false });

function getContract(): Contract {
  if (!config.contractId) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ID is required for on-chain interactions.");
  }
  return new Contract(config.contractId);
}

export async function ensureWalletConnection(): Promise<string> {
  ensureKit();
  const { address } = await StellarWalletsKit.authModal();
  return address;
}

export async function getCampaignState(): Promise<CampaignState> {
  if (!config.contractId) {
    return fallbackCampaignState;
  }

  try {
    const goalResp = await server.simulateTransaction(buildReadTx("campaign_goal", []));
    const totalResp = await server.simulateTransaction(buildReadTx("total_raised", []));

    const goal = Number(scValToNative(extractRetval(goalResp)));
    const totalRaised = Number(scValToNative(extractRetval(totalResp)));

    // Fetch recent events to populate the activity log
    const recentDonations = await fetchRecentDonations();

    return { goal, totalRaised, recentDonations };
  } catch (error) {
    console.error("Error fetching campaign state:", error);
    return fallbackCampaignState;
  }
}

async function fetchRecentDonations(): Promise<Donation[]> {
  try {
    const latestLedger = await server.getLatestLedger();
    const events = await server.getEvents({
      startLedger: latestLedger.sequence - 10000, // Look back ~10k ledgers
      filters: [
        {
          type: "contract",
          contractIds: [config.contractId],
        },
      ],
      limit: 10,
    });

    return events.events
      .filter(e => scValToNative(e.topic[0]) === "donate")
      .map(e => {
        const amount = Number(scValToNative(e.value).amount);
        const donor = scValToNative(e.topic[1]);
        return {
          donor,
          amount,
          txHash: e.txHash,
        };
      })
      .reverse();
  } catch (error) {
    console.warn("Failed to fetch events:", error);
    return [];
  }
}

function extractRetval(response: rpc.Api.SimulateTransactionResponse): xdr.ScVal {
  if (rpc.Api.isSimulationError(response)) {
    throw new Error(response.error);
  }

  if (!response.result) {
    throw new Error("Simulation returned no result.");
  }

  return response.result.retval;
}

function buildReadTx(method: string, args: xdr.ScVal[]) {
  const source = Address.fromString(
    "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"
  );
  const account = new Account(source.toString(), "0");

  return new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(getContract().call(method, ...args))
    .setTimeout(30)
    .build();
}

export async function donate(address: string, amount: number): Promise<{ txHash: string }> {
  ensureKit();
  if (!config.contractId) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ID is required for on-chain donations.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const account = await server.getAccount(address);

  let tx = new TransactionBuilder(account, {
    fee: "2000",
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      getContract().call("donate", new Address(address).toScVal(), nativeToScVal(amount, { type: "i128" }))
    )
    .setTimeout(120)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(simulated.error);
  }

  tx = rpc.assembleTransaction(tx, simulated).build();

  const { signedTxXdr } = await StellarWalletsKit.signTransaction(tx.toXDR(), {
    networkPassphrase: config.networkPassphrase,
    address,
  });

  if (!signedTxXdr) {
    throw new Error("Unable to sign transaction");
  }

  const txResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, config.networkPassphrase));

  if (txResponse.status === "ERROR") {
    throw new Error(txResponse.errorResult?.result().switch().name ?? "Transaction failed");
  }

  return { txHash: txResponse.hash };
}

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

// Initialize the multi-wallet kit using the static API of version 2.x
// Wrap in a browser check to prevent SSR errors during Next.js build
if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    network: config.networkPassphrase as Networks,
    modules: [
      new FreighterModule(),
      new AlbedoModule(),
      new xBullModule(),
      new HanaModule(),
    ],
  });
}

const server = new rpc.Server(config.rpcUrl, { allowHttp: false });

function getContract(): Contract {
  if (!config.contractId) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ID is required for on-chain interactions.");
  }
  return new Contract(config.contractId);
}

export async function ensureWalletConnection(): Promise<string> {
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

    const recentDonations: Donation[] = [];
    return { goal, totalRaised, recentDonations };
  } catch (_error) {
    return fallbackCampaignState;
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

  // Use the static signTransaction method
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

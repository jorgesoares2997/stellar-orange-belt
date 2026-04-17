export const config = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID ?? "",
  networkPassphrase:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ??
    "Test SDF Network ; September 2015",
  rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org",
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org",
  campaignGoal: Number(process.env.NEXT_PUBLIC_CAMPAIGN_GOAL ?? 1000),
};

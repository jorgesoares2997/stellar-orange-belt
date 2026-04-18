"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { config } from "@/lib/config";
import { donate, ensureWalletConnection, getCampaignState } from "@/lib/stellar";
import { DashboardHeader } from "./dashboard-header";
import { CampaignStats } from "./campaign-stats";
import { FundingProgress } from "./funding-progress";
import { WalletPanel } from "./wallet-panel";
import { DonationForm } from "./donation-form";
import { ActivityLog } from "./activity-log";

export function AppShell() {
  const queryClient = useQueryClient();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("10");
  const [toast, setToast] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["campaign-state"],
    queryFn: getCampaignState,
  });

  const connectMutation = useMutation({
    mutationFn: ensureWalletConnection,
    onSuccess: (address) => {
      setWalletAddress(address);
      setToast("Wallet connected successfully");
      setTimeout(() => setToast(""), 5000);
    },
    onError: (error) => {
      setToast(error instanceof Error ? error.message : "Connection failed");
      setTimeout(() => setToast(""), 5000);
    },
  });

  const donateMutation = useMutation({
    mutationFn: async () => {
      if (!walletAddress) throw new Error("Connect wallet first");
      return donate(walletAddress, Number(amount));
    },
    onSuccess: ({ txHash: hash }) => {
      setTxHash(hash);
      setToast("Donation submitted! Awaiting confirmation...");
      queryClient.invalidateQueries({ queryKey: ["campaign-state"] });
      setTimeout(() => setToast(""), 5000);
    },
    onError: (error) => {
      setToast(error instanceof Error ? error.message : "Donation failed");
      setTimeout(() => setToast(""), 5000);
    },
  });

  const progress = useMemo(() => {
    if (!data?.goal) return 0;
    return Math.min((data.totalRaised / data.goal) * 100, 100);
  }, [data?.goal, data?.totalRaised]);

  const toastTone = donateMutation.isError || connectMutation.isError ? "error" : "info";

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card orange-glow overflow-hidden rounded-[2.5rem]"
        >
          <DashboardHeader isFetching={isFetching} />

          <div className="p-6 sm:p-12">
            <CampaignStats 
              totalRaised={data?.totalRaised ?? 0} 
              goal={data?.goal ?? config.campaignGoal} 
              isLoading={isLoading} 
            />

            <FundingProgress progress={progress} />

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <WalletPanel 
                address={walletAddress} 
                isConnecting={connectMutation.isPending} 
                onConnect={() => connectMutation.mutate()} 
              />
              <DonationForm 
                amount={amount} 
                setAmount={setAmount} 
                isDonating={donateMutation.isPending} 
                isConnected={!!walletAddress} 
                onDonate={() => donateMutation.mutate()} 
              />
            </div>

            <ActivityLog 
              donations={data?.recentDonations ?? []} 
              isLoading={isLoading} 
            />
          </div>

          <footer className="border-t border-white/5 bg-black/20 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 Orange Belt Protocol. Powered by <span className="text-orange-400 font-bold">Soroban</span>.
            </p>
            {txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-orange-400 transition-colors hover:text-orange-300"
              >
                LAST TX: {txHash.slice(0, 8)}... <ExternalLink size={12} />
              </a>
            )}
          </footer>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className={clsx(
              "rounded-2xl p-4 shadow-2xl backdrop-blur-xl border flex items-center gap-4",
              toastTone === "error" ? "bg-red-500/20 border-red-500/20 text-red-200" : "bg-orange-500 border-white/20 text-white"
            )}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                {toastTone === "error" ? <Clock size={16} /> : <ShieldCheck size={16} />}
              </div>
              <p className="text-sm font-bold tracking-tight">
                {toast}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


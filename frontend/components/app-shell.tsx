"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Info,
  History,
  Coins,
  ShieldCheck,
  Zap
} from "lucide-react";
import { config } from "@/lib/config";
import { donate, ensureWalletConnection, getCampaignState } from "@/lib/stellar";

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

  const remaining = Math.max((data?.goal ?? config.campaignGoal) - (data?.totalRaised ?? 0), 0);
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
          {/* Header/Hero Section */}
          <header className="relative border-b border-white/5 bg-white/5 px-6 py-10 sm:px-12 sm:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-2 shadow-lg shadow-orange-500/20">
                    <Zap className="fill-white text-white" size={24} />
                  </div>
                  <span className="font-display text-sm font-bold tracking-[0.2em] uppercase text-orange-400">
                    Orange Belt Protocol
                  </span>
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                  Stellar Micro <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Crowdfunding</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-slate-300">
                  Fuel the next generation of Soroban smart contracts with a real-time, peer-to-peer donation ecosystem powered by Stellar.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm font-semibold text-orange-300 backdrop-blur-md">
                  <div className={clsx("h-2 w-2 rounded-full", isFetching ? "animate-pulse bg-orange-400" : "bg-orange-500")} />
                  {isFetching ? "Syncing Mesh..." : "Stellar Testnet"}
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Soroban Secured
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 sm:p-12">
            {/* Stats Overview */}
            <section className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Total Raised", value: `${data?.totalRaised ?? 0} XLM`, icon: TrendingUp, color: "text-orange-400" },
                { label: "Campaign Goal", value: `${data?.goal ?? config.campaignGoal} XLM`, icon: Target, color: "text-amber-400" },
                { label: "Remaining", value: `${remaining} XLM`, icon: Clock, color: "text-slate-400" },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="glass-card glass-card-hover rounded-3xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                      <stat.icon size={24} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold text-white tracking-tight">
                        {isLoading ? "..." : stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>

            {/* Progress Visualization */}
            <section className="mt-12">
              <div className="glass-card rounded-[2rem] p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">Campaign Velocity</h2>
                    <p className="mt-1 text-slate-400">Live tracking of on-chain contribution progress.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
                    <TrendingUp size={16} />
                    {Math.round(progress)}% Funded
                  </div>
                </div>

                <div className="mt-8">
                  <div className="relative h-6 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="relative h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-300"
                    >
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Initiation</span>
                    <span>{Math.round(progress)}% Complete</span>
                    <span>Objective</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Interaction Layer */}
            <section className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Wallet Integration */}
              <article className="glass-card flex flex-col justify-between rounded-[2rem] p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Wallet size={20} />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">Wallet Uplink</h2>
                  </div>
                  <p className="mt-4 text-slate-400">Connect your freighter wallet to authorize secure transactions on the Stellar network.</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className={clsx(
                          "text-sm font-bold",
                          walletAddress ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {walletAddress ? "LINKED READY" : "AWAITING CONNECTION"}
                        </span>
                        <div className={clsx(
                          "h-2 w-2 rounded-full",
                          walletAddress ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
                        )} />
                      </div>
                    </div>
                    
                    {walletAddress && (
                      <div className="rounded-2xl border border-white/5 bg-black/20 p-4 font-mono text-xs text-orange-200/70">
                        {walletAddress}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => connectMutation.mutate()}
                  disabled={connectMutation.isPending}
                  className={clsx(
                    "mt-8 group flex items-center justify-center gap-2",
                    walletAddress ? "btn-secondary" : "btn-primary"
                  )}
                >
                  <Wallet size={18} />
                  {connectMutation.isPending ? "Connecting Interface..." : walletAddress ? "Interface Active" : "Connect Freighter"}
                  {!walletAddress && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
                </button>
              </article>

              {/* Donation Interface */}
              <article className="glass-card flex flex-col justify-between rounded-[2rem] p-8">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <Coins size={20} />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">Contribution</h2>
                  </div>
                  <p className="mt-4 text-slate-400">Specify XLM allocation for the current funding round.</p>
                  
                  <div className="mt-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="amount">
                      Transmission Volume (XLM)
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="amount"
                        type="number"
                        min={1}
                        className="glass-input w-full rounded-2xl pr-16"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        XLM
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => donateMutation.mutate()}
                    disabled={donateMutation.isPending || !walletAddress}
                    className="btn-primary group flex w-full items-center justify-center gap-2"
                  >
                    <Zap size={18} className="fill-white" />
                    {donateMutation.isPending ? "Transmitting..." : "Initiate Donation"}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                    <Info size={12} />
                    Sign transaction in Freighter to confirm.
                  </p>
                </div>
              </article>
            </section>

            {/* Ledger Activity */}
            <section className="mt-12">
              <div className="glass-card rounded-[2rem] overflow-hidden">
                <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History size={20} className="text-slate-400" />
                    <h2 className="font-display text-xl font-bold text-white">Network Activity</h2>
                  </div>
                </div>
                
                <div className="p-4 sm:p-8">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                      ))}
                    </div>
                  ) : data?.recentDonations.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                            <th className="pb-4 pl-4 font-bold">Contributor</th>
                            <th className="pb-4 font-bold">Protocol Volume</th>
                            <th className="pb-4 text-right pr-4 font-bold">Artifact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {data.recentDonations.map((donation) => (
                            <tr key={donation.txHash} className="group transition-colors hover:bg-white/5">
                              <td className="py-4 pl-4">
                                <span className="font-mono text-sm text-slate-300">
                                  {donation.donor.slice(0, 8)}...{donation.donor.slice(-6)}
                                </span>
                              </td>
                              <td className="py-4">
                                <span className="font-bold text-orange-400">{donation.amount} XLM</span>
                              </td>
                              <td className="py-4 text-right pr-4">
                                <a 
                                  href={`https://stellar.expert/explorer/testnet/tx/${donation.txHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-slate-400 transition-colors hover:bg-orange-500 hover:text-white"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-white/5 p-4 text-slate-500">
                        <History size={32} />
                      </div>
                      <p className="text-slate-400">No network activity recorded. Be the genesis donor.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Footer Branding */}
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

      {/* Dynamic Toast / Feedback */}
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

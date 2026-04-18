"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

interface DashboardHeaderProps {
  isFetching: boolean;
}

export function DashboardHeader({ isFetching }: DashboardHeaderProps) {
  return (
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
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
          >
            Stellar Micro <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Crowdfunding</span>
          </motion.h1>
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
  );
}

"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface FundingProgressProps {
  progress: number;
}

export function FundingProgress({ progress }: FundingProgressProps) {
  return (
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
  );
}

"use client";

import { Coins, Zap, ArrowRight, Info } from "lucide-react";
import { clsx } from "clsx";

interface DonationFormProps {
  amount: string;
  setAmount: (val: string) => void;
  isDonating: boolean;
  isConnected: boolean;
  onDonate: () => void;
}

export function DonationForm({ amount, setAmount, isDonating, isConnected, onDonate }: DonationFormProps) {
  return (
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
          onClick={onDonate}
          disabled={isDonating || !isConnected}
          className="btn-primary group flex w-full items-center justify-center gap-2"
        >
          <Zap size={18} className="fill-white" />
          {isDonating ? "Transmitting..." : "Initiate Donation"}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
        <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <Info size={12} />
          Sign transaction in your wallet to confirm.
        </p>
      </div>
    </article>
  );
}

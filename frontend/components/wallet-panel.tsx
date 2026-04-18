"use client";

import { Wallet, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface WalletPanelProps {
  address: string;
  isConnecting: boolean;
  onConnect: () => void;
}

export function WalletPanel({ address, isConnecting, onConnect }: WalletPanelProps) {
  return (
    <article className="glass-card flex flex-col justify-between rounded-[2rem] p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Wallet size={20} />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Wallet Uplink</h2>
        </div>
        <p className="mt-4 text-slate-400">Connect your preferred Stellar wallet to authorize secure transactions on the Testnet.</p>
        
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
            <div className="mt-1 flex items-center justify-between">
              <span className={clsx(
                "text-sm font-bold",
                address ? "text-emerald-400" : "text-amber-400"
              )}>
                {address ? "LINKED READY" : "AWAITING CONNECTION"}
              </span>
              <div className={clsx(
                "h-2 w-2 rounded-full",
                address ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
              )} />
            </div>
          </div>
          
          {address && (
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4 font-mono text-xs text-orange-200/70 break-all">
              {address}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onConnect}
        disabled={isConnecting}
        className={clsx(
          "mt-8 group flex items-center justify-center gap-2",
          address ? "btn-secondary" : "btn-primary"
        )}
      >
        <Wallet size={18} />
        {isConnecting ? "Connecting Interface..." : address ? "Interface Active" : "Connect Wallet"}
        {!address && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
      </button>
    </article>
  );
}

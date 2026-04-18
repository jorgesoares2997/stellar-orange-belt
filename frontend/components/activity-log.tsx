"use client";

import { History, ExternalLink } from "lucide-react";
import type { Donation } from "@/lib/types";

interface ActivityLogProps {
  donations: Donation[];
  isLoading: boolean;
}

export function ActivityLog({ donations, isLoading }: ActivityLogProps) {
  return (
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
          ) : donations.length ? (
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
                  {donations.map((donation) => (
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
  );
}

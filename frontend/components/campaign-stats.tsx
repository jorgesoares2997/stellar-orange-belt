"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Clock } from "lucide-react";
import { config } from "@/lib/config";

interface CampaignStatsProps {
  totalRaised: number;
  goal: number;
  isLoading: boolean;
}

export function CampaignStats({ totalRaised, goal, isLoading }: CampaignStatsProps) {
  const remaining = Math.max((goal || config.campaignGoal) - (totalRaised || 0), 0);

  const stats = [
    { label: "Total Raised", value: `${totalRaised ?? 0} XLM`, icon: TrendingUp, color: "text-orange-400" },
    { label: "Campaign Goal", value: `${goal || config.campaignGoal} XLM`, icon: Target, color: "text-amber-400" },
    { label: "Remaining", value: `${remaining} XLM`, icon: Clock, color: "text-slate-400" },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, i) => (
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
  );
}

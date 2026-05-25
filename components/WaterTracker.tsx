"use client";

import { motion } from "framer-motion";
import { useStore, useTodayLog } from "@/lib/store";
import { useEffect, useState } from "react";
import { PLAN } from "@/data/plan";

const GLASS_ML = 250;

export function WaterTracker() {
  const [mounted, setMounted] = useState(false);
  const today = useTodayLog();
  const addWater = useStore((s) => s.addWater);
  useEffect(() => setMounted(true), []);

  const totalGlasses = Math.round(PLAN.water / GLASS_ML);
  const filled = mounted ? Math.min(totalGlasses, Math.floor(today.water / GLASS_ML)) : 0;
  const ml = mounted ? today.water : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[0.7rem] font-mono tracking-wider text-muted uppercase">
          Water
        </div>
        <div className="text-xs font-mono text-muted">
          <span className="text-text font-medium">{(ml / 1000).toFixed(1)}</span>
          <span className="text-muted">/{(PLAN.water / 1000).toFixed(0)}L</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Array.from({ length: totalGlasses }).map((_, i) => {
          const isFilled = i < filled;
          return (
            <motion.div
              key={i}
              className="flex-1 min-w-[14px] h-7 rounded-md border border-border-strong overflow-hidden relative"
              animate={{ backgroundColor: isFilled ? "rgba(0,255,136,0.15)" : "rgba(0,255,136,0)" }}
              transition={{ duration: 0.2 }}
            >
              {isFilled && (
                <motion.div
                  className="absolute inset-0 bg-accent/40"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => addWater(-GLASS_ML)}
          className="flex-1 py-2 rounded-xl border border-border text-muted-2 hover:text-text hover:border-border-strong transition-colors text-sm"
        >
          − 250ml
        </button>
        <button
          onClick={() => addWater(GLASS_ML)}
          className="flex-1 py-2 rounded-xl bg-accent text-black font-semibold text-sm"
        >
          + 250ml
        </button>
      </div>
    </div>
  );
}

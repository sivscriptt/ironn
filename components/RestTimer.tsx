"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  seconds: number;
  onDone?: () => void;
  onCancel: () => void;
};

export function RestTimer({ seconds, onDone, onCancel }: Props) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  const pct = Math.max(0, remaining / seconds);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/95 backdrop-blur-xl border border-accent/30 rounded-3xl px-6 py-5 shadow-2xl shadow-accent/10"
    >
      <div className="flex items-center gap-5">
        <div className="relative" style={{ width: 80, height: 80 }}>
          <svg width="80" height="80" className="-rotate-90">
            <circle cx="40" cy="40" r={radius / 1.2} stroke="var(--border)" strokeWidth="5" fill="none" />
            <motion.circle
              cx="40"
              cy="40"
              r={radius / 1.2}
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference / 1.2}
              animate={{ strokeDashoffset: offset / 1.2 }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-lg font-mono font-bold">
              {mm}:{ss.toString().padStart(2, "0")}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase">
            Rest
          </div>
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-2 hover:text-text"
          >
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useStore, computeStreak } from "@/lib/store";
import { useEffect, useState } from "react";

const MONTH = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function TodayHeader({ subtitle }: { subtitle?: string }) {
  const [mounted, setMounted] = useState(false);
  const dayLogs = useStore((s) => s.dayLogs);
  useEffect(() => setMounted(true), []);
  const streak = mounted ? computeStreak(dayLogs) : 0;

  const now = new Date();
  const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][now.getDay()];
  const month = MONTH[now.getMonth()];
  const date = now.getDate();

  return (
    <div className="px-5 pt-6 pb-2 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display font-extrabold text-[1.3rem] tracking-tight">
            ironn
          </span>
        </div>
        <div className="mt-3 text-[0.62rem] font-mono tracking-wider text-muted uppercase">
          {day} · {month} {date}
          {subtitle && <span className="ml-1.5 text-text">· {subtitle}</span>}
        </div>
      </div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.15 }}
        className="flex items-center gap-1.5 bg-surface border border-border rounded-full px-2.5 py-1.5"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#ff6b35">
          <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-2-1-4-3-6 0 2-1 3-2 3-2 0-1-3 1-5l-2-3z" />
        </svg>
        <span className="text-xs font-mono">{streak}</span>
      </motion.div>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 128 128" className="w-7 h-7" fill="none">
      <rect width="128" height="128" rx="24" fill="#0a0a0a" />
      <rect x="16" y="20" width="3" height="54" rx="1" fill="#3a3a3a" />
      <rect x="109" y="20" width="3" height="54" rx="1" fill="#3a3a3a" />
      <rect x="22" y="56" width="84" height="4" rx="2" fill="#00ff88" />
      <rect x="4" y="40" width="8" height="20" rx="2" fill="#00ff88" />
      <rect x="10" y="32" width="7" height="28" rx="2" fill="#00ff88" />
      <rect x="16" y="24" width="6" height="36" rx="2" fill="#00ff88" />
      <rect x="116" y="40" width="8" height="20" rx="2" fill="#00ff88" />
      <rect x="111" y="32" width="7" height="28" rx="2" fill="#00ff88" />
      <rect x="106" y="24" width="6" height="36" rx="2" fill="#00ff88" />
    </svg>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TodayHeader } from "@/components/TodayHeader";
import { useStore, computeDayTotals, nonNegotiablesHit, computeStreak, type SetLog } from "@/lib/store";
import { PLAN } from "@/data/plan";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function epley(weight: number, reps: number): number {
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const sessions = useStore((s) => s.sessions);
  const dayLogs = useStore((s) => s.dayLogs);
  const weighIns = useStore((s) => s.weighIns);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>
        <TodayHeader subtitle="STATS" />
        <div className="px-5 pt-2 text-muted text-sm">Loading…</div>
      </>
    );
  }

  // Workouts total
  const finishedSessions = sessions.filter((s) => s.finishedAt);
  const totalWorkouts = finishedSessions.length;

  // Total volume (sum of weight × reps across all sets)
  const totalVolume = finishedSessions.reduce((acc, sess) => {
    return (
      acc +
      sess.exercises.reduce(
        (a, e) => a + e.sets.reduce((b, s) => b + s.weight * s.reps, 0),
        0,
      )
    );
  }, 0);

  const streak = computeStreak(dayLogs);

  // PRs per main lift
  const prByExercise = new Map<string, { weight: number; reps: number; e1rm: number; date: string }>();
  for (const sess of finishedSessions) {
    for (const e of sess.exercises) {
      for (const s of e.sets) {
        const e1 = epley(s.weight, s.reps);
        const existing = prByExercise.get(e.exerciseKey);
        if (!existing || e1 > existing.e1rm) {
          prByExercise.set(e.exerciseKey, {
            weight: s.weight,
            reps: s.reps,
            e1rm: e1,
            date: sess.date,
          });
        }
      }
    }
  }

  // Main lift names (look up from PLAN)
  const exerciseNameMap = new Map<string, string>();
  for (const w of Object.values(PLAN.workouts)) {
    if (w.type !== "lift") continue;
    for (const ex of w.exercises) {
      if (ex.isMainLift) exerciseNameMap.set(ex.key, ex.name);
    }
  }
  const mainLiftPRs = Array.from(exerciseNameMap.entries())
    .map(([key, name]) => ({ key, name, pr: prByExercise.get(key) }))
    .filter((x) => x.pr);

  // Last 30 days adherence
  const today = new Date();
  const days30: { date: string; hit: number; total: number; hasData: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const log = dayLogs[dateStr];
    if (!log) {
      days30.push({ date: dateStr, hit: 0, total: 5, hasData: false });
    } else {
      const totals = computeDayTotals(log);
      const nn = nonNegotiablesHit(log, totals);
      days30.push({ date: dateStr, hit: nn.hit, total: nn.total, hasData: true });
    }
  }

  // Weight chart from weighIns + today's quick log
  const weightPoints = [...weighIns].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <TodayHeader subtitle="STATS" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-2 pb-6 space-y-4">
        {/* TOP STATS */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          <StatCard label="Workouts done" value={String(totalWorkouts)} />
          <StatCard label="Day streak" value={String(streak)} highlight />
          <StatCard label="Volume lifted" value={`${(totalVolume / 1000).toFixed(1)}t`} sub="tonnes" />
          <StatCard label="PRs hit" value={String(mainLiftPRs.length)} />
        </motion.div>

        {/* ADHERENCE */}
        <motion.section variants={item} className="bg-card border border-border rounded-2xl p-4">
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-3">
            Last 30 days · adherence
          </div>
          <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
            {days30.map((d) => {
              const intensity = d.hasData ? Math.min(1, d.hit / d.total) : 0;
              const bg = !d.hasData
                ? "bg-surface-2"
                : intensity >= 1
                  ? "bg-accent"
                  : intensity >= 0.6
                    ? "bg-accent/60"
                    : intensity >= 0.3
                      ? "bg-accent/30"
                      : "bg-surface-2";
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.hit}/${d.total}`}
                  className={`aspect-square rounded-sm ${bg}`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-3 text-[0.62rem] font-mono text-muted">
            <span>30 days ago</span>
            <div className="flex items-center gap-1">
              <span>less</span>
              <div className="w-2 h-2 rounded-sm bg-surface-2" />
              <div className="w-2 h-2 rounded-sm bg-accent/30" />
              <div className="w-2 h-2 rounded-sm bg-accent/60" />
              <div className="w-2 h-2 rounded-sm bg-accent" />
              <span>more</span>
            </div>
            <span>today</span>
          </div>
        </motion.section>

        {/* WEIGHT */}
        <motion.section variants={item} className="bg-card border border-border rounded-2xl p-4">
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-2">
            Weight trend
          </div>
          {weightPoints.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted">
              Log weight on Today tab to see trend
            </div>
          ) : (
            <>
              <WeightLine points={weightPoints.map((w) => ({ date: w.date, value: w.weight }))} />
              <div className="flex justify-between text-[0.7rem] font-mono text-muted mt-2">
                <span>{weightPoints[0].weight} kg</span>
                <span className="text-text">latest {weightPoints[weightPoints.length - 1].weight} kg</span>
              </div>
            </>
          )}
        </motion.section>

        {/* STRENGTH */}
        <motion.section variants={item}>
          <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-2 px-1">
            Personal records
          </div>
          {mainLiftPRs.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted">
              Log some workouts to see PRs
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              {mainLiftPRs.map(({ name, pr }) => (
                <div key={name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-[0.7rem] text-muted font-mono">
                      {pr!.weight} kg × {pr!.reps} · {pr!.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-accent">
                      {pr!.e1rm}
                      <span className="text-[0.62rem] text-muted ml-0.5">kg e1RM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="text-[0.6rem] font-mono tracking-wider text-muted uppercase mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-display font-extrabold text-3xl ${highlight ? "text-accent" : "text-text"}`}>
          {value}
        </span>
        {sub && <span className="text-[0.7rem] text-muted font-mono">{sub}</span>}
      </div>
    </div>
  );
}

function WeightLine({ points }: { points: { date: string; value: number }[] }) {
  if (points.length === 0) return null;
  const w = 320;
  const h = 80;
  const pad = 10;
  const values = points.map((p) => p.value);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const range = max - min || 1;
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((p.value - min) / range) * (h - pad * 2);
    return { x, y };
  });
  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="3" fill="var(--accent)" />
      ))}
    </svg>
  );
}

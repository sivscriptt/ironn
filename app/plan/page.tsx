"use client";

import { motion } from "framer-motion";
import { TodayHeader } from "@/components/TodayHeader";
import { PLAN, type DayKey } from "@/data/plan";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export default function PlanPage() {
  return (
    <>
      <TodayHeader subtitle="THE PLAN" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-2 pb-6 space-y-5">
        {/* HERO */}
        <motion.div variants={item} className="bg-card border border-border rounded-2xl p-5">
          <h1 className="font-display text-3xl font-extrabold leading-none mb-1.5">
            The Path
          </h1>
          <p className="text-sm text-muted-2 leading-relaxed">
            57 kg cut to lean, then build. 1700 kcal / 145g protein. 5 lift + 2 cardio per week.
            Track every set. Hit non-negotiables. Show up daily.
          </p>
        </motion.div>

        {/* TARGETS */}
        <motion.section variants={item}>
          <SectionHeader title="Daily targets" />
          <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 gap-3">
            <Stat label="Calories (train)" value={`${PLAN.macros.train.kcal}`} unit="kcal" />
            <Stat label="Calories (rest)" value={`${PLAN.macros.rest.kcal}`} unit="kcal" />
            <Stat label="Protein" value={`${PLAN.macros.train.protein}`} unit="g" highlight />
            <Stat label="Carbs" value={`${PLAN.macros.train.carbs}`} unit="g" />
            <Stat label="Fat" value={`${PLAN.macros.train.fat}`} unit="g" />
            <Stat label="Water" value={`${(PLAN.water / 1000).toFixed(0)}`} unit="L" />
            <Stat label="Steps" value={`${(PLAN.steps / 1000).toFixed(0)}k`} unit="min" />
            <Stat label="Sleep" value="7.5+" unit="hours" />
          </div>
        </motion.section>

        {/* SCHEDULE */}
        <motion.section variants={item}>
          <SectionHeader title="Weekly schedule" />
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {DAYS.map(({ key, label }) => {
              const w = PLAN.workouts[PLAN.schedule[key]];
              const tint =
                w.type === "lift" ? "text-[#4d8eff]" : w.type === "cardio" ? "text-[#00ddc1]" : "text-muted";
              return (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="text-[0.65rem] font-mono text-muted w-8">{label.toUpperCase()}</div>
                    <div className="text-sm font-medium">{w.name}</div>
                  </div>
                  <div className={`text-[0.7rem] font-mono ${tint} uppercase`}>{w.type}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* DAILY SCHEDULE */}
        <motion.section variants={item}>
          <SectionHeader title="Daily rhythm" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {PLAN.dailySchedule.map((s, i) => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <div className="text-[0.7rem] font-mono text-accent w-20 shrink-0">{s.time}</div>
                <div className="text-[0.82rem] text-text leading-snug">{s.what}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SUPPLEMENTS */}
        <motion.section variants={item}>
          <SectionHeader title="Supplement stack" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {PLAN.supplements.map((s) => (
              <div key={s.key} className="px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-[0.7rem] text-accent font-mono">{s.dose}</div>
                </div>
                <div className="text-[0.72rem] text-muted-2 mt-0.5">
                  {s.timing} · {s.why}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* NON-NEGOTIABLES */}
        <motion.section variants={item}>
          <SectionHeader title="10 non-negotiables" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {PLAN.nonNegotiables.map((rule, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-6 h-6 rounded-full bg-accent/15 text-accent text-[0.7rem] font-mono font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="text-[0.82rem] leading-snug">{rule}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* PROGRESSION */}
        <motion.section variants={item}>
          <SectionHeader title="Progression rules" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {PLAN.progressionRules.map((rule, i) => (
              <div key={i} className="px-4 py-3 text-[0.82rem] leading-snug">
                {rule}
              </div>
            ))}
          </div>
        </motion.section>

        {/* EXPECTED RESULTS */}
        <motion.section variants={item}>
          <SectionHeader title="Expected results" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {PLAN.expectedResults.map((r, i) => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <div className="text-[0.7rem] font-mono text-accent w-16 shrink-0">
                  Week {r.week}
                </div>
                <div className="text-[0.82rem] leading-snug">{r.what}</div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase mb-2 px-1">
      {title}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-[0.6rem] font-mono tracking-wider text-muted uppercase mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono font-bold text-2xl ${highlight ? "text-accent" : "text-text"}`}>
          {value}
        </span>
        {unit && <span className="text-[0.7rem] text-muted font-mono">{unit}</span>}
      </div>
    </div>
  );
}

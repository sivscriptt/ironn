"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TodayHeader } from "@/components/TodayHeader";
import { Checkbox } from "@/components/Checkbox";
import { SetLogger } from "@/components/SetLogger";
import { RestTimer } from "@/components/RestTimer";
import { PLAN, todayKey, isLift, isCardio, isRest } from "@/data/plan";
import { useStore } from "@/lib/store";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function TrainPage() {
  const dayKey = todayKey();
  const workoutKey = PLAN.schedule[dayKey];
  const workout = PLAN.workouts[workoutKey];

  return (
    <>
      <TodayHeader subtitle={workout.name.toUpperCase()} />
      <div className="px-5 pt-2">
        <div className="text-[0.62rem] font-mono tracking-wider text-muted uppercase mb-1">
          {workout.focus}
        </div>
        <h1 className="font-display text-[2rem] font-extrabold leading-none mb-1">
          {workout.name}
        </h1>
        <div className="text-xs text-muted font-mono">{workout.duration}</div>
      </div>

      {isLift(workout) && <LiftView workoutKey={workoutKey} workout={workout} />}
      {isCardio(workout) && <CardioView workout={workout} />}
      {isRest(workout) && <RestView workout={workout} />}
    </>
  );
}

function LiftView({ workoutKey, workout }: { workoutKey: any; workout: any }) {
  const startSession = useStore((s) => s.startSession);
  const finishSession = useStore((s) => s.finishSession);
  const activeSession = useStore((s) => s.getActiveSession());
  const sessions = useStore((s) => s.sessions);
  const getLastSetFor = useStore((s) => s.getLastSetFor);

  const [warmupChecked, setWarmupChecked] = useState<Record<string, boolean>>({});
  const [finisherChecked, setFinisherChecked] = useState<Record<string, boolean>>({});
  const [cooldownChecked, setCooldownChecked] = useState<Record<string, boolean>>({});
  const [restSec, setRestSec] = useState<number | null>(null);

  const sess = activeSession?.workoutKey === workoutKey ? activeSession : null;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-5 pb-6 space-y-5">
      {!sess && (
        <motion.button
          variants={item}
          onClick={() => startSession(workoutKey)}
          className="w-full py-4 rounded-2xl bg-accent text-black font-bold text-base flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start workout
        </motion.button>
      )}

      {/* WARMUP */}
      <motion.section variants={item}>
        <SectionHeader title="Warm-up" detail="10 min" />
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          {workout.warmup.map((step: any, i: number) => (
            <CheckRow
              key={i}
              label={step.name}
              detail={step.detail}
              checked={!!warmupChecked[i]}
              onChange={(v) => setWarmupChecked({ ...warmupChecked, [i]: v })}
            />
          ))}
        </div>
      </motion.section>

      {/* EXERCISES */}
      <motion.section variants={item}>
        <SectionHeader title="Lifts" detail={`${workout.exercises.length} exercises`} />
        <div className="space-y-3">
          {workout.exercises.map((ex: any) => {
            const loggedSets =
              sess?.exercises.find((e) => e.exerciseKey === ex.key)?.sets ?? [];
            return (
              <SetLogger
                key={ex.key}
                sessionId={sess?.id ?? "none"}
                exercise={ex}
                loggedSets={sess ? loggedSets : []}
                lastSetEver={getLastSetFor(ex.key)}
                onSetLogged={(s) => setRestSec(s)}
              />
            );
          })}
        </div>
        {!sess && (
          <div className="text-center text-xs text-muted mt-3">
            Tap "Start workout" above to enable set logging
          </div>
        )}
      </motion.section>

      {/* FINISHER */}
      <motion.section variants={item}>
        <SectionHeader title="Ab finisher" detail="10 min" />
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          {workout.finisher.map((step: any, i: number) => (
            <CheckRow
              key={i}
              label={step.name}
              detail={`${step.sets} × ${step.reps}`}
              checked={!!finisherChecked[i]}
              onChange={(v) => setFinisherChecked({ ...finisherChecked, [i]: v })}
            />
          ))}
        </div>
      </motion.section>

      {/* COOLDOWN */}
      <motion.section variants={item}>
        <SectionHeader title="Cool down" detail="5 min" />
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          {workout.cooldown.map((step: any, i: number) => (
            <CheckRow
              key={i}
              label={step.name}
              detail={step.duration}
              checked={!!cooldownChecked[i]}
              onChange={(v) => setCooldownChecked({ ...cooldownChecked, [i]: v })}
            />
          ))}
        </div>
      </motion.section>

      {sess && (
        <motion.button
          variants={item}
          onClick={() => {
            finishSession(sess.id);
          }}
          className="w-full py-4 rounded-2xl bg-surface border border-accent text-accent font-bold text-base"
        >
          ✓ Finish workout
        </motion.button>
      )}

      <AnimatePresence>
        {restSec !== null && (
          <RestTimer
            seconds={restSec}
            onDone={() => setRestSec(null)}
            onCancel={() => setRestSec(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CardioView({ workout }: { workout: any }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-5 pb-6 space-y-3">
      {workout.blocks.map((b: any, i: number) => (
        <motion.div
          key={i}
          variants={item}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-base font-semibold">{b.name}</div>
            <div className="text-xs text-accent font-mono">{b.duration}</div>
          </div>
          <div className="text-[0.8rem] text-muted-2 leading-relaxed mb-3">{b.detail}</div>
          <button
            onClick={() => setChecked({ ...checked, [i]: !checked[i] })}
            className={`w-full py-2 rounded-xl text-xs font-medium transition-colors ${
              checked[i]
                ? "bg-accent/10 border border-accent text-accent"
                : "bg-surface border border-border text-muted-2"
            }`}
          >
            {checked[i] ? "✓ Done" : "Mark done"}
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}

function RestView({ workout }: { workout: any }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="px-5 pt-5 pb-6 space-y-2">
      {workout.actions.map((a: any, i: number) => (
        <motion.button
          key={i}
          variants={item}
          onClick={() => setChecked({ ...checked, [i]: !checked[i] })}
          className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-colors ${
            checked[i] ? "bg-accent/10 border-accent/40" : "bg-card border-border"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-lg flex-shrink-0">
            {a.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold ${checked[i] ? "line-through text-muted" : ""}`}>
              {a.name}
            </div>
            <div className="text-[0.78rem] text-muted-2 leading-relaxed mt-0.5">{a.detail}</div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

function SectionHeader({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-2 px-1">
      <div className="text-[0.65rem] font-mono tracking-wider text-muted uppercase">{title}</div>
      {detail && <div className="text-[0.62rem] font-mono text-muted">{detail}</div>}
    </div>
  );
}

function CheckRow({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left"
    >
      <Checkbox checked={checked} onChange={onChange} size={20} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${checked ? "line-through text-muted" : ""}`}>{label}</div>
        {detail && <div className="text-[0.7rem] text-muted font-mono">{detail}</div>}
      </div>
    </button>
  );
}

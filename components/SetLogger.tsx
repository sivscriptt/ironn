"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Exercise } from "@/data/plan";
import { useStore, type SetLog } from "@/lib/store";
import { Checkbox } from "./Checkbox";
import { ExerciseImage } from "./ExerciseImage";

type Props = {
  sessionId: string;
  exercise: Exercise;
  loggedSets: SetLog[];
  lastSetEver?: SetLog;
  onSetLogged: (restSec: number) => void;
};

export function SetLogger({ sessionId, exercise, loggedSets, lastSetEver, onSetLogged }: Props) {
  const logSet = useStore((s) => s.logSet);
  const removeLastSet = useStore((s) => s.removeLastSet);

  const initialWeight = lastSetEver?.weight ?? 0;
  const initialReps = parseInt(exercise.reps.split("-")[0] || "10", 10);

  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);

  const setsDone = loggedSets.length;
  const setsLeft = Math.max(0, exercise.sets - setsDone);
  const isDone = setsDone >= exercise.sets;

  function handleLog() {
    logSet(sessionId, exercise.key, { reps, weight });
    onSetLogged(exercise.restSec);
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="px-3 py-3 flex items-center gap-3 border-b border-border">
        <ExerciseImage
          slug={exercise.image}
          className="w-14 h-14 rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold truncate">{exercise.name}</div>
            {isDone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
          </div>
          <div className="text-[0.7rem] text-muted font-mono">
            {exercise.sets} × {exercise.reps} · {exercise.restSec}s rest
          </div>
        </div>
        <div className="text-xs font-mono text-muted shrink-0">
          <span className={isDone ? "text-accent" : "text-text"}>{setsDone}</span>
          <span className="text-muted">/{exercise.sets}</span>
        </div>
      </div>

      {/* LOGGED SETS */}
      <AnimatePresence initial={false}>
        {loggedSets.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-1 space-y-1.5">
              {loggedSets.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-3 py-1.5 bg-surface rounded-lg text-xs font-mono"
                >
                  <span className="text-muted w-6">#{i + 1}</span>
                  <span className="text-text font-medium">{s.weight}</span>
                  <span className="text-muted text-[0.62rem]">kg</span>
                  <span className="text-muted">×</span>
                  <span className="text-text font-medium">{s.reps}</span>
                  <span className="text-muted text-[0.62rem]">reps</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT */}
      {!isDone && (
        <div className="p-4 pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <NumberStepper
              label="Weight (kg)"
              value={weight}
              onChange={setWeight}
              step={2.5}
              decimal
            />
            <NumberStepper
              label="Reps"
              value={reps}
              onChange={setReps}
              step={1}
            />
          </div>
          <button
            onClick={handleLog}
            className="w-full py-3 rounded-xl bg-accent text-black font-bold text-sm"
          >
            Log set {setsDone + 1}
            {lastSetEver && (
              <span className="ml-2 text-black/60 text-[0.7rem] font-mono font-normal">
                last: {lastSetEver.weight}kg × {lastSetEver.reps}
              </span>
            )}
          </button>
          {loggedSets.length > 0 && (
            <button
              onClick={() => removeLastSet(sessionId, exercise.key)}
              className="w-full py-1.5 text-xs text-muted-2 hover:text-text"
            >
              Undo last set
            </button>
          )}
        </div>
      )}

      {exercise.notes && (
        <div className="px-4 pb-3 text-[0.7rem] text-muted-2 italic">
          {exercise.notes}
        </div>
      )}
    </div>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  step,
  decimal,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  decimal?: boolean;
}) {
  return (
    <div>
      <div className="text-[0.6rem] font-mono tracking-wider text-muted uppercase mb-1.5">
        {label}
      </div>
      <div className="flex items-center bg-surface border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => onChange(Math.max(0, +(value - step).toFixed(decimal ? 1 : 0)))}
          className="px-3 py-2 text-muted-2 hover:text-text active:bg-surface-2 text-lg leading-none w-9"
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value || ""}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            onChange(isNaN(n) ? 0 : n);
          }}
          placeholder="0"
          className="flex-1 min-w-0 text-center bg-transparent font-mono text-base font-semibold text-text focus:outline-none py-2"
        />
        <button
          onClick={() => onChange(+(value + step).toFixed(decimal ? 1 : 0))}
          className="px-3 py-2 text-muted-2 hover:text-text active:bg-surface-2 text-lg leading-none w-9"
        >
          +
        </button>
      </div>
    </div>
  );
}

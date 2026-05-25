"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

type Props = {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label: string;
  unit?: string;
};

export function ProgressRing({
  value,
  max,
  size = 84,
  stroke = 6,
  color = "var(--accent)",
  trackColor = "var(--border)",
  label,
  unit = "",
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, max > 0 ? value / max : 0);

  const motionValue = useMotionValue(circumference);
  const animatedValue = useMotionValue(0);
  const displayValue = useTransform(animatedValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, circumference - circumference * pct, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    const c2 = animate(animatedValue, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      controls.stop();
      c2.stop();
    };
  }, [value, pct, circumference, motionValue, animatedValue]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: motionValue }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="text-[0.95rem] font-mono font-semibold leading-none">
            {displayValue}
          </motion.div>
          {unit && (
            <div className="text-[0.55rem] text-muted font-mono mt-0.5">{unit}</div>
          )}
        </div>
      </div>
      <div className="text-[0.62rem] font-mono tracking-wider text-muted uppercase">
        {label}
      </div>
    </div>
  );
}

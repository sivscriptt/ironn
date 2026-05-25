"use client";

import { useEffect, useRef, useState } from "react";
import { exerciseFrameUrl } from "@/data/plan";

type Props = {
  slug?: string;
  className?: string;
  intervalMs?: number;
  /** When true, only show 0 frame (no animation). For thumbnails outside view. */
  paused?: boolean;
};

export function ExerciseImage({
  slug,
  className = "",
  intervalMs = 850,
  paused = false,
}: Props) {
  const [frame, setFrame] = useState<0 | 1>(0);
  const [errored, setErrored] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setFrame(0);
    setErrored(false);
  }, [slug]);

  useEffect(() => {
    if (paused || !slug || errored) return;
    intervalRef.current = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, slug, errored, intervalMs]);

  if (!slug || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-2 text-muted text-[0.6rem] font-mono ${className}`}
      >
        ··
      </div>
    );
  }

  return (
    <div className={`bg-white overflow-hidden ${className}`}>
      <img
        src={exerciseFrameUrl(slug, frame)}
        alt=""
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

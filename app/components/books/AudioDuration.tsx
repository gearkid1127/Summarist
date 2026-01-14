"use client";

import { useEffect, useState } from "react";
import { getAudioDurationSeconds } from "@/app/lib/getAudioDuration";

function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function AudioDuration({ audioLink }: { audioLink?: string | null }) {
  const [label, setLabel] = useState("00:00");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!audioLink) return setLabel("00:00");

      try {
        const seconds = await getAudioDurationSeconds(audioLink);
        if (!cancelled) setLabel(formatDuration(seconds));
      } catch {
        if (!cancelled) setLabel("00:00");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [audioLink]);

  return <>{label}</>;
}

import { useState } from "react";
import useClientLoop from "./useClientLoop";
import { formatTime, FormatTimeOptions } from "@repo/lib";

interface TimerProps {
  name: string;
  options?: FormatTimeOptions;
}

export function useTimerStateSecond(name: string) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(0);

  useClientLoop(name, (frames) => {
    setSecondsRemaining(frames);
  });

  return secondsRemaining ?? 0;
}

export default function Timer({ name, options }: TimerProps) {
  const secondsRemaining = useTimerStateSecond(name);

  return <span>{formatTime(secondsRemaining, options)}</span>;
}

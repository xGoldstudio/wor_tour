import { useState } from "react";
import useClientLoop from "./useClientLoop";
import { formatTime, FormatTimeOptions } from "@repo/lib";

interface TimerProps {
  name: string;
  options?: FormatTimeOptions;
}

export default function Timer({ name, options }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(0); 

  useClientLoop(name, (frames) => {
    setSecondsRemaining(frames);
  });

  if (secondsRemaining === null) {
    return null;
  }

  return <span>{formatTime(secondsRemaining, options)}</span>;
}

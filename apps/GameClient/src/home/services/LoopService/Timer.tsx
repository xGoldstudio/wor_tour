import { useState } from "react";
import useClientLoop from "./useClientLoop";
import { formatTime } from "@repo/lib";

interface TimerProps {
  name: string;
}

export default function Timer({ name }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0); 

  useClientLoop(name, (frames) => {
    setSecondsRemaining(frames ?? 0);
  });

  return <span>{formatTime(secondsRemaining)}</span>;
}

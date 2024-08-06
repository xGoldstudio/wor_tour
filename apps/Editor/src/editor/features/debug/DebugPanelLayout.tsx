import React from "react";
import { Button, UseRunInstance } from "@repo/ui";

export default function DebugPanelLayout({
  instance,
  children,
}: {
  instance: UseRunInstance;
  children?: React.ReactNode;
}) {
  const { pause, setSpeed, speed, isPlaying, runTicks } = instance;

  function setSpeedButton(speedArg: number) {
    return (
      <Button
        action={() => setSpeed?.(speedArg)}
        rarity={speed === 1 / speedArg && isPlaying ? "epic" : "rare"}
        full
      >
        x{speedArg}
      </Button>
    );
  }

  function addTicksButton(ticks: number) {
    return (
      <Button action={() => runTicks?.(ticks)} full>
        +{ticks} ticks
      </Button>
    );
  }

  return (
    <div className="flex gap-4 h-full flex-col justify-center">
      <p className="text-2xl font-semibold">Game management</p>
      <div className="grid grid-cols-6 gap-4">
        <Button
          action={() => pause?.()}
          rarity={isPlaying ? "rare" : "epic"}
          full
        >
          Pause
        </Button>
        {setSpeedButton(0.25)}
        {setSpeedButton(0.5)}
        {setSpeedButton(1)}
        {setSpeedButton(2)}
        {setSpeedButton(10)}
        {addTicksButton(1)}
        {addTicksButton(10)}
        {addTicksButton(1000)}
      </div>
      {children}
    </div>
  );
}

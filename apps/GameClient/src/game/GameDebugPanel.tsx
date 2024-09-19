import { IS_DEBUG } from "@/isDebug";
import { GAME_OPTS } from "./gameBehavior/useGameEvents";
import { botOptions } from "./gameBehavior/aiAgent";
import FpsPrint from "./FpsPrint";
import { ClockReturn, EventType, InGameCardType } from "game_engine";
import DebugButton from "@/debug/DebugButton";
import usePersistentState from "@/debug/usePersistentState";
import { useOnMount, useOnUnMount } from "@repo/ui";

interface GameDebugPanelProps {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  runTicks: (amount: number) => void;
  clock: ClockReturn<EventType>;
}

export default function GameDebugPanel({
  play,
  pause,
  isPlaying,
  runTicks,
  clock,
}: GameDebugPanelProps) {
  const [isOpen, setIsOpen] = usePersistentState<boolean>("game-debug-panel-open", true);

  function toggleDebugPanel(e: KeyboardEvent) {
    if (e.key === " ") {
      setIsOpen(prev => !prev);
    }
  }

  useOnMount(() => {
    window.addEventListener("keydown", toggleDebugPanel);
  });

  useOnUnMount(() => {
    window.removeEventListener("keydown", toggleDebugPanel);
  });

  if (!IS_DEBUG() || !isOpen) {
    return <></>;
  }

  function triggerDrawGame() {
    clock.triggerEvent({ type: "gameOver", winner: "draw" });
  }

  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4 z-50">
      <FpsPrint />
      <DebugButton onClick={isPlaying ? pause : play}>
        {isPlaying ? "pause" : "play"}
      </DebugButton>
      <div className="flex gap-4">
        <DebugButton onClick={() => runTicks(1)}>+1</DebugButton>
        <DebugButton onClick={() => runTicks(10)}>+10</DebugButton>
        <DebugButton onClick={() => runTicks(100)}>+100 (1s)</DebugButton>
        <DebugButton onClick={() => runTicks(6000)}>+6000 (1m)</DebugButton>
      </div>
      <DebugButton
        onClick={() => {
          clock.triggerEvent({
            type: "playerDamageResolve",
            initiator: {
              type: "playerDamage",
              isPlayer: false,
              damage: 99999,
              initiator: {
                type: "cardAttacking",
                instanceId: 1,
                cardIniator: {} as InGameCardType,
              },
            },
          });
        }}
      >
        Kill opponent
      </DebugButton>
      <DebugButton
        onClick={() => {
          clock.triggerEvent({
            type: "playerDamageResolve",
            initiator: {
              type: "playerDamage",
              isPlayer: true,
              damage: 99999,
              initiator: {
                type: "cardAttacking",
                instanceId: 1,
                cardIniator: {} as InGameCardType,
              },
            },
          });
        }}
      >
        Kill yourself
      </DebugButton>
      <DebugButton onClick={triggerDrawGame}>Draw game</DebugButton>
      <DebugButton onClick={() => (botOptions.disabled = !botOptions.disabled)}>
        Toggle bot activation
      </DebugButton>
      <DebugButton
        onClick={() =>
          (GAME_OPTS.simulateBadPerformance = !GAME_OPTS.simulateBadPerformance)
        }
      >
        Toggle bad perf
      </DebugButton>
    </div>
  );
}

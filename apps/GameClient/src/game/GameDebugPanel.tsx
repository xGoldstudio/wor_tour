import { IS_DEBUG } from "@/isDebug";
import { GAME_OPTS } from "./gameBehavior/useGameEvents";
import { botOptions } from "./gameBehavior/aiAgent";
import FpsPrint from "./FpsPrint";
import { ClockReturn, EventType, InGameCardType } from "game_engine";

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
  if (!IS_DEBUG()) {
    return <></>;
  }

  function triggerDrawGame() {
    clock.triggerEvent({ type: "gameOver", winner: "draw" });
  }

  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
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
                  isPlayer: true,
                  cardPosition: 1,
                  instanceId: 1,
                  cardIniator: {} as InGameCardType,
              }
            }
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
                isPlayer: false,
                cardPosition: 1,
                instanceId: 1,
                cardIniator: {} as InGameCardType,
              }
            }
          });
        }}
      >
        Kill yourself
      </DebugButton>
      <DebugButton onClick={triggerDrawGame}>Draw game</DebugButton>
      <DebugButton onClick={() => botOptions.disabled = !botOptions.disabled}>Toggle bot activation</DebugButton>
      <DebugButton onClick={() => GAME_OPTS.simulateBadPerformance = !GAME_OPTS.simulateBadPerformance}>Toggle bad perf</DebugButton>
   </div>
  );
}

export function DebugButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <button className="px-2 py-1 border-2 border-white" onClick={onClick}>
      {children}
    </button>
  );
}

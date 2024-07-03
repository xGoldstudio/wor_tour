import { IS_DEBUG } from "@/isDebug";
import { GAME_OPTS, TriggerGameEvent } from "./gameBehavior/useGameEvents";
import { botOptions } from "./gameBehavior/aiAgent";
import FpsPrint from "./FpsPrint";

interface GameDebugPanelProps {
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
}

export default function GameDebugPanel({
  togglePlay,
  isClockRunning,
  fastForward,
}: GameDebugPanelProps) {
  if (!IS_DEBUG()) {
    return <></>;
  }
  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <FpsPrint />
      <DebugButton onClick={togglePlay}>
        {isClockRunning ? "pause" : "play"}
      </DebugButton>
      <div className="flex gap-4">
        <DebugButton onClick={() => fastForward(1)}>+1</DebugButton>
        <DebugButton onClick={() => fastForward(10)}>+10</DebugButton>
        <DebugButton onClick={() => fastForward(100)}>+100 (1s)</DebugButton>
        <DebugButton onClick={() => fastForward(6000)}>+6000 (1m)</DebugButton>
      </div>
      <DebugButton
        onClick={() => {
          TriggerGameEvent?.({
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
              }
            }
          });
        }}
      >
        Kill opponent
      </DebugButton>
      <DebugButton
        onClick={() => {
          TriggerGameEvent?.({
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
              }
            }
          });
        }}
      >
        Kill yourself
      </DebugButton>
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

import { IS_DEBUG } from "@/isDebug";
import {
  TriggerGameEvent
} from "./gameBehavior/useGameEvents";

interface GameDebugPanelProps {
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
  destroyGame: () => void;
}

export default function GameDebugPanel({
  togglePlay,
  isClockRunning,
  fastForward,
  destroyGame,
}: GameDebugPanelProps) {
  if (!IS_DEBUG()) {
    return <></>;
  }
  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <DebugButton onClick={togglePlay}>
        {isClockRunning ? "pause" : "play"}
      </DebugButton>
      <div className="flex gap-4">
        <DebugButton onClick={() => fastForward(1)}>+1</DebugButton>
        <DebugButton onClick={() => fastForward(10)}>+10</DebugButton>
        <DebugButton onClick={() => fastForward(100)}>+100</DebugButton>
      </div>
      <DebugButton
        onClick={() => {
          TriggerGameEvent?.({
            type: "playerDamage",
            damage: 999999,
            isPlayer: false,
            initiator: {
              type: "cardAttacking",
              isPlayer: true,
              cardPosition: 1,
              instanceId: 1,
            }
          });
        }}
      >
        Kill opponent
      </DebugButton>
      <DebugButton
        onClick={() => {
          TriggerGameEvent?.({
            type: "playerDamage",
            damage: 999999,
            isPlayer: true,
            initiator: {
              type: "cardAttacking",
              isPlayer: true,
              cardPosition: 1,
              instanceId: 1,
            }
          });
        }}
      >
        Kill yourself
      </DebugButton>
      <DebugButton
        onClick={() => {
          togglePlay();
          destroyGame();
        }}
      >
        leave game
      </DebugButton>
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

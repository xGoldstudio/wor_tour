import { GameStore } from "@/game/stores/gameStateStore";
import { FRAME_TIME, manaSpeed } from "../gameBehavior/useGameEvents";
import { useGameAnimation } from "../gameBehavior/animation/useGameSyncAnimation";
import { ManaBall } from "@repo/ui";

interface ManaBarProps {
  isPlayer: boolean;
  mana: number;
}

function ManaBar({ isPlayer, mana }: ManaBarProps) {
  return (
    <div className="gap-2 grid grid-cols-9 w-full h-[28px] relative my-[6px] pl-[30px]">
      <div className="absolute top-[-6px]">
        <ManaBall mana={mana} />
      </div>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
        // using index as key is ok since the order is static
        if (index < mana) {
          return <ManaSubBarComplete key={index} />;
        } else {
          return (
            <ManaSubBarProgress
              key={index}
              manaIndex={index}
              isPlayer={isPlayer}
            />
          );
        }
      })}
    </div>
  );
}

function ManaSubBarComplete() {
  return (
    <EmptyBar>
      <div className="w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F]" />
    </EmptyBar>
  );
}

export function EmptyBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full h-full left-0 bg-gradient-to-b  from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] shadow-md relative">
      {children}
    </div>
  );
}

function ManaSubBarProgress({
  manaIndex,
  isPlayer,
}: {
  manaIndex: number;
  isPlayer: boolean;
}) {
  const animationRef = useGameAnimation<GameStore & { currentTick: number }>(
    (state) => {
      if (manaIndex !== (isPlayer ? state.playerMana : state.opponentMana)) {
        return {
          transform: `scaleX(0%)`,
        };
      }
      const runningManaEarningProgress =
        (state.currentTick -
          (isPlayer
            ? state.playerTickStartEarningMana
            : state.opponentTickStartEarningMana)!) /
        (manaSpeed / FRAME_TIME);
      return {
        transform: `scaleX(${runningManaEarningProgress * 100}%)`,
      };
    }
  );

  return (
    <EmptyBar>
      <div
        ref={animationRef}
        className="w-full h-full left-0 bg-gradient-to-b from-[#C164BA] via-[#FACDF7] via-[37%] to-[#C164BA] origin-left scale-x-0"
      />
    </EmptyBar>
  );
}

export default ManaBar;

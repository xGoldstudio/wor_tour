import useGameStore, { GameStore } from "@/game/stores/gameStateInterface";
import { useRef, useState } from "react";
import { FRAME_TIME, manaSpeed } from "../gameBehavior/useGameEvents";
import { useGameAnimation } from "../gameBehavior/animation/useGameSyncAnimation";

interface ManaBarProps {
  isPlayer: boolean;
  mana: number;
}

function ManaBar({ isPlayer, mana }: ManaBarProps) {
  const manaTimestamp = useGameStore((state) =>
    isPlayer
      ? state.playerTickStartEarningMana
      : state.opponentTickStartEarningMana
  );

  const [oldTimestamp, setOldTimestamp] = useState(manaTimestamp);
  const progressBarSlider = useRef<HTMLDivElement | null>(null);

  const isTimeStampDifferent =
    manaTimestamp !== oldTimestamp && manaTimestamp !== null;
  if (isTimeStampDifferent) {
    setOldTimestamp(manaTimestamp);

    if (progressBarSlider.current) {
      progressBarSlider.current.animate(
        [{ transform: "scaleX(0%)" }, { transform: "scaleX(100%)" }],
        manaSpeed
      );
    }
  }

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
    <div className="w-full h-full left-0 bg-gradient-to-b  from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] shadow-md overflow-hddien">
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

export function ManaBall({ mana }: { mana: number }) {
  return (
    <div className="h-[40px] w-[40px] flex justify-center items-center z-10">
      <div className="absolute top-[2px] left-[1px] h-[39px] w-[39px] bg-[linear-gradient(60deg,#d193cc_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center blur-[2px]"></div>
      <div className="z-10 absolute h-[38px] w-[38px] bg-[linear-gradient(60deg,_rgba(136,21,127,1)_0%,_rgba(212,100,203,1)_100%)] rounded-full flex justify-center items-center"></div>
      <div
        className="z-10 relative h-[38px] w-[38px] rounded-full
	bg-[radial-gradient(at_95%_15%,#DCA9D8,_rgba(184,121,179,1)_22%,#9f3897_45%,_rgba(184,121,179,1)_68%,_rgba(207,137,201,1)_100%)]
	shadow-md font-[stylised] text-white flex justify-center items-center text-xl"
      >
        {mana}
      </div>
    </div>
  );
}

export default ManaBar;

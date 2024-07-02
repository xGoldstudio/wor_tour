import { useGameAnimation } from "../gameBehavior/animation/useGameSyncAnimation";
import animationTimeline from "../gameBehavior/animation/timeline";
import _ from "lodash";
import { ManaBallWrapper } from "../../../../../packages/ui/components/ManaBall";
import { useState } from "react";

function ManaBar() {
  const [mana, setMana] = useState(0);

  const animationRef = useGameAnimation({
    tl: (ref, state) =>
      animationTimeline(state.playerManaSpeed).add(
        ref,
        { scaleX: 1},
        [
          {
            values: { scaleX: 1.2 },
            from: -50,
            ease: [0, 1, 1, 1],
          },
          {
            values: { scaleX: 0.85 },
            from: -30,
            ease: [0, 1, 1, 1],
          },
          {
            values: { scaleX: 1 },
            from: -15,
            ease: [0, 0.42, 1, 1],
          },
        ]
      ),
    getProgress: (state, currentTick, ref) => {
      const startEarningMana = state.playerTickStartEarningMana;
      if (startEarningMana !== null) {
        const progress = currentTick - startEarningMana;
        const manaTarget = state.playerMana + 1;
        if (mana !== manaTarget && progress > (state.playerManaSpeed - 50)) {
          ref.innerHTML = String(manaTarget); // the inner html ensure that the content is frame perfect, react will then do its job normally
          setMana(manaTarget);
        }
        return currentTick - startEarningMana;
      }
      return 0;
    },
  });

  return (
    <div className="gap-2 grid grid-cols-9 w-full h-[28px] relative my-[6px] pl-[30px]">
      <div className="absolute top-[-6px] z-10" >
        <ManaBallWrapper>
          <div ref={animationRef}>{mana}</div>
        </ManaBallWrapper>
      </div>
      {_.times(9).map((index) => (
        <ManaSubBarProgress key={index} manaIndex={index} />
      ))}
    </div>
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
}: {
  manaIndex: number;
}) {
  const animationRef = useGameAnimation({
    tl: (ref, state) =>
      animationTimeline(state.playerManaSpeed)
        .add(ref, { scaleX: 0 }, { values: { scaleX: 1 }, to: -50 })
        .add(`#manaBar_bg_${manaIndex}`, { scaleX: 0 }, [
          { values: { scaleX: 1.05 }, from: -50, ease: [0, 1, 1, 1] },
          { values: { scaleX: 0.85 }, from: -30, ease: [0, 1, 1, 1] },
          { values: { scaleX: 1 }, from: -15, ease: [0, 0.42, 1, 1] },
        ]),
    getProgress: (state, currentTick) => {
      const mana = state.playerMana;
      const startEarningMana = state.playerTickStartEarningMana;
      if (startEarningMana !== null && mana === manaIndex) {
        return currentTick - startEarningMana;
      } else if (mana > manaIndex) {
        return -1;
      }
      return 0;
    },
  });

  return (
    <EmptyBar>
      <div
        ref={animationRef}
        className="w-full h-full left-0 bg-gradient-to-b from-[#C164BA] via-[#FACDF7] via-[37%] to-[#C164BA] origin-left scale-x-0"
      />
      <div
        className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left"
        id={`manaBar_bg_${manaIndex}`}
      />
    </EmptyBar>
  );
}

export default ManaBar;

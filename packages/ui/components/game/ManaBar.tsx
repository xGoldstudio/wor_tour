import _ from "lodash";
import { ManaBallWrapper } from "../ManaBall";
import { useRef, useState } from "react";
import {
  EmptyBar, useGameEventListener,
  useSyncGameAnimation
} from "@repo/ui";
import { animationTimeline } from "@repo/lib";
import {
  GameStateObject,
  ManaConsumeEvent,
  ManaIncreaseEvent,
} from "game_engine";

function ManaBar() {
  const [mana, setMana] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { triggerAnimation } = useSyncGameAnimation();
  useGameEventListener({
    type: "manaIncrease",
    action: (_, state) => {
      setManaValue(state);
    },
    filter: (event) => (event as ManaIncreaseEvent).isPlayer,
  });
  useGameEventListener({
    type: "manaConsume",
    action: (_, state) => {
      setManaValue(state);
    },
    filter: (event) => (event as ManaConsumeEvent).isPlayer,
  });

  function setManaValue(state: GameStateObject) {
    if (ref.current) {
      ref.current.innerHTML = String(state.playerMana); // the inner html ensure that the content is frame perfect, react will then do its job normally
      triggerAnimation({
        duration: 50,
        computeStyle: animationTimeline(50).add(
          ref.current,
          { scaleX: 1 },
          [
            {
              values: { scaleX: 1.2 },
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
        ).progress,
      });
    }
    setMana(state.playerMana);
  }

  return (
    <div className="gap-2 grid grid-cols-9 w-full h-[28px] relative my-[6px] pl-[30px]">
      <div className="absolute top-[-6px] z-10">
        <ManaBallWrapper>
          <div ref={ref}>{mana}</div>
        </ManaBallWrapper>
      </div>
      {_.times(9).map((index) => (
        <ManaSubBarProgress key={index} manaIndex={index} />
      ))}
    </div>
  );
}

function ManaSubBarProgress({ manaIndex }: { manaIndex: number }) {
  const animationRef = useRef<HTMLDivElement>(null);
  const changeManaAnimationRef = useRef<HTMLDivElement>(null);
  const { triggerAnimation, removeAnimation } = useSyncGameAnimation();
  const {
    triggerAnimation: changeManaTriggerAnimation,
    removeAnimation: changeManaRemoveAnimation,
  } = useSyncGameAnimation();
  useGameEventListener({
    type: "startEarningMana",
    action: (_, state, __, clock) => {
      if (state.playerMana === manaIndex && animationRef.current) {
        triggerAnimation({
          duration: state.playerManaSpeed,
          computeStyle: animationTimeline(state.playerManaSpeed).add(
            animationRef.current,
            { scaleX: 0 },
            { values: { scaleX: 1 } }
          ).progress,
        })?.fastForward(
          clock.getImmutableInternalState().currentFrame -
            state.playerTickStartEarningMana!
        );
      } else {
        removeAnimation();
      }
      if (state.playerMana < manaIndex && animationRef.current) {
        animationRef.current.style.transform = "scaleX(0)";
      } else if (state.playerMana > manaIndex && animationRef.current) {
        animationRef.current.style.transform = "scaleX(1)";
      }
    },
    filter: (event) => (event as ManaIncreaseEvent).isPlayer,
  });
  useGameEventListener({
    type: "manaIncrease",
    action: (_, state) => changeManaEvent(state, true),
    filter: (event) => (event as ManaIncreaseEvent).isPlayer,
  });
  useGameEventListener({
    type: "manaConsume",
    action: (_, state) => changeManaEvent(state, false),
    filter: (event) => (event as ManaConsumeEvent).isPlayer,
  });
  const changeManaAnimationDuration = 40;
  function changeManaEvent(state: GameStateObject, direction: boolean) {
    if (state.playerMana - 1 === manaIndex && changeManaAnimationRef.current) {
      changeManaTriggerAnimation({
        duration: changeManaAnimationDuration,
        computeStyle: (direction ? increaseManaTimeline : decreaseManaTimeline)(
          changeManaAnimationRef.current
        ).progress,
      });
    } else if (
      manaIndex > state.playerMana - 1 &&
      changeManaAnimationRef.current
    ) {
      changeManaRemoveAnimation();
      changeManaAnimationRef.current.style.transform = "scaleX(0)";
    }
  }
  const increaseManaTimeline = (ref: HTMLElement) =>
    animationTimeline(changeManaAnimationDuration).add(ref, { scaleX: 0 }, [
      { values: { scaleX: 1.05 }, from: -30, ease: [0, 1, 1, 1] },
      { values: { scaleX: 0.85 }, from: -20, ease: [0, 1, 1, 1] },
      { values: { scaleX: 1 }, from: -10, ease: [0, 0.42, 1, 1] },
    ]);
  const decreaseManaTimeline = (ref: HTMLElement) =>
    animationTimeline(changeManaAnimationDuration).add(ref, { scaleX: 1 }, [
      { values: { scaleX: 0.85 }, from: -30, ease: [0, 1, 1, 1] },
      { values: { scaleX: 1.05 }, from: -20, ease: [0, 1, 1, 1] },
      { values: { scaleX: 1 }, from: -10, ease: [0, 0.42, 1, 1] },
    ]);

  return (
    <EmptyBar>
      <div
        ref={animationRef}
        className="w-full h-full left-0 bg-gradient-to-b from-[#C164BA] via-[#FACDF7] via-[37%] to-[#C164BA] origin-left scale-x-0"
      />
      <div
        className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left scale-x-0"
        ref={changeManaAnimationRef}
      />
    </EmptyBar>
  );
}

export default ManaBar;

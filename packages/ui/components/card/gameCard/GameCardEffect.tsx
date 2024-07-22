import {
  AddStateEvent,
  CardState,
  DecreaseStateValueEvent,
  IncreaseStateValueEvent,
  RemoveStateEvent,
  TriggerStateEvent,
} from "game_engine";
import { useSyncGameAnimation } from "../useGameSyncAnimation";
import { useRef, useState } from "react";
import { useOnMount } from "../../../lib/lifecycle";
import { animationTimeline, getStateData, inPx } from "@repo/lib";
import useGameEventListener from "../useGameEventListener";
import { EffectLayout } from "../Effects";

interface GameCardEffectProps {
  position: number;
  isPlayerCard: boolean;
  state: CardState;
  removeState: (type: CardState["type"]) => void;
  statePosition: number;
}

export function GameCardEffect({
  position,
  isPlayerCard,
  state,
  removeState,
  statePosition,
}: GameCardEffectProps) {
  const size = 0.8;
  const { triggerAnimation } = useSyncGameAnimation();
  const { triggerAnimation: triggerPositionAnimation } = useSyncGameAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState] = useState(state);
  const prevStatePosition = useRef(statePosition);

  function getPaddingOffset(usingStatePosition: number) {
    return usingStatePosition * size * (42 + 8) + 8 * size;
  }
  if (prevStatePosition.current !== statePosition) {
    // since its an array, we are forced to relay on react props (which can lead to small desyncronisation from the game loop)
    triggerPositionAnimation({
      replace: true,
      duration: 10,
      computeStyle: animationTimeline(10).add(
        positionRef.current,
        { y: getPaddingOffset(prevStatePosition.current) },
        [
          {
            values: { y: getPaddingOffset(statePosition) },
            ease: [0, 1, 1, 1],
            onStart: () => {
              prevStatePosition.current = statePosition;
            },
          },
        ]
      ).progress,
    });
  }

  function isCurrentEffectEvent(event: {
    isPlayerCard: boolean;
    position: number;
    stateType: CardState["type"];
  }) {
    return (
      event.isPlayerCard === isPlayerCard &&
      event.position === position &&
      event.stateType === state.type
    );
  }
  useOnMount(() => {
    appearAnimation();
  });
  function appearAnimation() {
    triggerAnimation({
      replace: true,
      duration: 40,
      computeStyle: animationTimeline(40).add(
        ref.current,
        { opacity: 0, scale: 0 },
        [
          {
            values: { scale: 1.05, opacity: 100 },
            ease: [0, 1, 1, 1],
          },
          { values: { scale: 0.85 }, from: -30, ease: [0, 1, 1, 1] },
          { values: { scale: 1 }, from: -10, ease: [0, 0.42, 1, 1] },
        ]
      ).progress,
    });
  }
  function scaleAnimation(
    bigger: boolean,
    stateFromGameState: CardState | null
  ) {
    if (!ref.current || stateFromGameState === null) {
      return;
    }
    setCurrentState({ ...stateFromGameState });
    triggerAnimation({
      replace: true,
      duration: 20,
      computeStyle: animationTimeline(20)
        // y is the current translation y of the ref
        .add(ref.current, { scale: 1 }, [
          {
            values: { scale: bigger ? 1.1 : 0.9 },
            ease: [0, 1, 1, 1],
          },
          { values: { scale: 1 }, from: -5, ease: [0, 1, 1, 1] },
        ]).progress,
    });
  }
  useGameEventListener({
    type: "increaseStateValue",
    action: (e, state) =>
      scaleAnimation(
        true,
        state.getStateOfCardByInstanceId(
          (e as IncreaseStateValueEvent).instanceId,
          (e as IncreaseStateValueEvent).stateType
        )
      ),
    filter: (e) => isCurrentEffectEvent(e as IncreaseStateValueEvent),
  });
  useGameEventListener({
    type: "decreaseStateValue",
    action: (e, state) =>
      scaleAnimation(
        false,
        state.getStateOfCardByInstanceId(
          (e as IncreaseStateValueEvent).instanceId,
          (e as IncreaseStateValueEvent).stateType
        )
      ),
    filter: (e) => isCurrentEffectEvent(e as DecreaseStateValueEvent),
  });
  useGameEventListener({
    type: "triggerState",
    action: () => {
      if (!ref.current) {
        return;
      }
      triggerAnimation({
        replace: true,
        duration: 40,
        computeStyle: animationTimeline(40)
          // y is the current translation y of the ref
          .add(ref.current, { scaleX: 1 }, [
            {
              values: { scaleX: 1.1 },
              ease: [0, 1, 1, 1],
            },
            { values: { scaleX: 1 }, from: -10, ease: [0, 1, 1, 1] },
          ]).progress,
      });
    },
    filter: (e) =>
      isCurrentEffectEvent({
        isPlayerCard: (e as TriggerStateEvent).isPlayerCard,
        position: (e as TriggerStateEvent).position,
        stateType: (e as TriggerStateEvent).state.type,
      }),
  });
  useGameEventListener({
    type: "removeState",
    action: () => {
      triggerAnimation({
        replace: true,
        duration: 40,
        onComplete: () => {
          removeState(state.type);
        },
        computeStyle: animationTimeline(40).add(
          ref.current,
          { opacity: 100, scale: 1 },
          [
            {
              values: { scale: 0.85, opacity: 100 },
              ease: [0, 1, 1, 1],
            },
            {
              values: { scale: 1.05, opacity: 100 },
              from: -30,
              ease: [0, 1, 1, 1],
            },
            {
              values: { scale: 0, opacity: 0 },
              from: -20,
              ease: [0, 0.42, 1, 1],
            },
          ]
        ).progress,
      });
    },
    filter: (e) => isCurrentEffectEvent(e as RemoveStateEvent),
  });
  useGameEventListener({
    type: "addState",
    action: () => {
      appearAnimation();
    }, // will cancel disapear animation, and so, the removeState event will not be triggered
    filter: (e) =>
      isCurrentEffectEvent({
        isPlayerCard: (e as AddStateEvent).isPlayerCard,
        position: (e as AddStateEvent).position,
        stateType: (e as AddStateEvent).state.type,
      }),
  });

  return (
    <div
      ref={positionRef}
      className="absolute right-0"
      style={{
        transform: `translateY(${inPx(getPaddingOffset(prevStatePosition.current))})`, // we are using prevStatePosition to avoid jumping due to desyncro of gameLoop and react render
      }}
    >
      <div ref={ref}>
        <EffectLayout
          effect={getStateData(currentState)}
          size={size}
          showDesc
        />
      </div>
    </div>
  );
}

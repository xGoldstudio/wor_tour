import {
  CardState,
  EventType,
  GameStateObject,
  PlaceCardEvent,
} from "game_engine";
import { useSyncGameAnimation } from "../useGameSyncAnimation";
import { useRef, useState } from "react";
import { animationTimeline, getStateData, translateYpx } from "@repo/lib";
import { EffectLayout } from "../Effects";
import useConsumeEvents from "../caputeEvents/useConsumeEvents";
import useGameEventListener from "../useGameEventListener";

interface GameCardEffectProps {
  state: CardState;
  removeState: (type: CardState["type"]) => void;
  statePosition: number;
  position: number;
  isPlayerCard: boolean;
}

export function GameCardEffect({
  state,
  removeState,
  statePosition,
  position,
  isPlayerCard,
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
  useGameEventListener({
    type: "placeCard",
    action: (event, gameState) => {
      const cardStateWithIndex = gameState.getStateOfCardWithIndex(
        (event as PlaceCardEvent).isPlayer,
        (event as PlaceCardEvent).position,
        state.type
      );
      if (cardStateWithIndex) {
        setCurrentState({ ...cardStateWithIndex[1] });
        prevStatePosition.current = cardStateWithIndex[0]; // in case a new card is placed with an effect present in the current card,
        // we must jump to the next position directly, without triggering any animation related to swap position
        if (positionRef.current)
          positionRef.current.style.transform = translateYpx(
            getPaddingOffset(cardStateWithIndex[0])
          );
      }
    },
    filter: (event) =>
      (event as PlaceCardEvent).position === position &&
      (event as PlaceCardEvent).isPlayer === isPlayerCard,
  });
  if (prevStatePosition.current !== statePosition) { // checking between value updated by events, and props related to cardStates react useState list
    changePostitionAnimation();
  }
  useConsumeEvents((event: EventType, gameState: GameStateObject) => {
    if (event.type === "addState" && event.state.type === currentState.type) {
      const state = gameState.getStateOfCardByInstanceId(event.instanceId, event.state.type);
      if (state) setCurrentState({ ...state });
      appearAnimation();
      return true;
    }
    if (event.type === "removeState" && event.stateType === currentState.type) {
      removeAnimation();
      return true;
    }
    if (
      event.type === "increaseStateValue" &&
      event.stateType === currentState.type
    ) {
      scaleAnimation(
        true,
        gameState.getStateOfCardByInstanceId(event.instanceId, event.stateType)
      );
      return true;
    }
    if (
      event.type === "decreaseStateValue" &&
      event.stateType === currentState.type
    ) {
      scaleAnimation(
        false,
        gameState.getStateOfCardByInstanceId(event.instanceId, event.stateType)
      );
      return true;
    }
    if (
      event.type === "triggerState" &&
      event.state.type === currentState.type
    ) {
      triggerStateAnimation();
      return true;
    }
    return null;
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
            values: { scale: bigger ? 1.3 : 0.7 },
            ease: [0, 1, 1, 1],
          },
          { values: { scale: 1 }, from: -5, ease: [0, 1, 1, 1] },
        ]).progress,
    });
  }
  function removeAnimation() {
    triggerAnimation({
      queueAnimation: true,
      duration: 20,
      onComplete: () => {
        removeState(state.type);
      },
      computeStyle: animationTimeline(20).add(
        ref.current,
        { opacity: 100, scale: 1 },
        [
          {
            values: { scale: 0.85, opacity: 100 },
            ease: [0, 1, 1, 1],
          },
          {
            values: { scale: 1.05, opacity: 100 },
            from: -10,
            ease: [0, 1, 1, 1],
          },
          {
            values: { scale: 0, opacity: 0 },
            from: -5,
            ease: [0, 0.42, 1, 1],
          },
        ]
      ).progress,
    });
  }
  function triggerStateAnimation() {
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
            values: { scaleX: 1.3 },
            ease: [0, 1, 1, 1],
          },
          { values: { scaleX: 1 }, from: -10, ease: [0, 1, 1, 1] },
        ]).progress,
    });
  }
  function changePostitionAnimation() {
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

  console.log(currentState);

  return (
    <div
      ref={positionRef}
      className="absolute right-0"
      style={{
        transform: translateYpx(getPaddingOffset(prevStatePosition.current)), // we are using prevStatePosition to avoid jumping due to desyncro of gameLoop and react render
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

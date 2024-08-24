import { AfterPlaceCardEvent, CardState, EventType, GameStateObject } from "game_engine";
import { useState } from "react";
import useGameEventListener from "../../useGameEventListener";
import { CaptureEvents } from "../../caputeEvents/CaptureEvents";
import { inPx } from "@repo/lib";
import { GameCardEffect } from "./GameCardEffect";

export default function CardEffectsElements({
  isPlayerCard,
  position,
  trackedInstanceId,
}: {
  isPlayerCard: boolean;
  position: number;
  trackedInstanceId: React.MutableRefObject<number | null>;
}) {
  const [states, setStates] = useState<CardState[]>([]);

  function setStatesFromGameState(state: GameStateObject) {
    const card = state.getCard(isPlayerCard, position);
    if (card) {
      setStates([...card.states]);
    }
  }
  function removeState(stateType: CardState["type"]) {
    setStates((states) => states.filter((s) => s.type !== stateType));
  }

  useGameEventListener<AfterPlaceCardEvent>({
    type: "afterPlaceCard",
    action: (_, state) => {
      setStatesFromGameState(state);
    },
    filter: (event) =>
      event.position === position && event.isPlayer === isPlayerCard,
  });

  const watcher = (event: EventType, state: GameStateObject) => {
    if (
      (event.type === "addState" ||
        event.type === "triggerState" ||
        event.type === "removeState" ||
        event.type === "increaseStateValue" ||
        event.type === "decreaseStateValue" ||
        event.type === "startStateDecay") &&
      event.instanceId === trackedInstanceId.current
    ) {
      if (event.type === "addState") setStatesFromGameState(state); // side effect
      return true;
    }
    return null;
  };

  return (
    <div className="absolute right-[4px] top-[5px] flex flex-col gap-2 z-10">
      <div
        className="flex flex-col absolute"
        style={{ top: 0, right: inPx(6 * 0.8) }}
      >
        <CaptureEvents watcher={watcher}>
          {states.map((state, index) => (
            <GameCardEffect
              state={state}
              removeState={removeState}
              key={state.type}
              statePosition={index}
              position={position}
              isPlayerCard={isPlayerCard}
            />
          ))}
        </CaptureEvents>
      </div>
    </div>
  );
}
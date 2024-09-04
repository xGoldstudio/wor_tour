import {
  CardState,
  DrawCardEvent,
  EventType,
  GameStateObject,
} from "game_engine";
import { useRef, useState } from "react";
import { inPx } from "@repo/lib";
import useGameEventListener from "../useGameEventListener";
import { CaptureEvents } from "../caputeEvents/CaptureEvents.tsx";
import CardEffect from "../cardEffect/CardEffect.tsx";

export default function HandCardEffects({
  isPlayerCard,
  position,
}: {
  isPlayerCard: boolean;
  position: number;
}) {
  const [states, setStates] = useState<CardState[]>([]);
  const trackedInstanceId = useRef<number | null>(null);

  function setStatesFromGameState(state: GameStateObject) {
    if (trackedInstanceId.current === null) return;
    const card = state.getDeckCardByInstanceId(trackedInstanceId.current);
    if (card) {
      setStates([...card.states]);
    }
  }
  function removeState(stateType: CardState["type"]) {
    setStates((states) => states.filter((s) => s.type !== stateType));
  }

  useGameEventListener<DrawCardEvent>({
    type: "drawCard",
    action: (_, state) => {
      trackedInstanceId.current =
        state.getHandCardInstanceId(position, isPlayerCard) ?? null;
      setStatesFromGameState(state);
    },
    filter: (event) =>
      event.position === position && event.isPlayer === isPlayerCard,
  });

  const watcher = (event: EventType, state: GameStateObject) => {
    if (
      (event.type === "addDeckCardState" ||
        event.type === "removeDeckCardState" ||
        event.type === "decreaseDeckCardStateValue" ||
        event.type === "increaseDeckCardStateValue") &&
      event.instanceId === trackedInstanceId.current
    ) {
      if (event.type === "addDeckCardState") setStatesFromGameState(state); // side effect
      return true;
    }
    return null;
  };

  return (
    <div
      className="flex flex-col absolute"
      style={{ top: 0, right: inPx(6 * 0.8) }}
    >
      <CaptureEvents watcher={watcher}>
        {states.map((state, index) => (
          <CardEffect
            state={state}
            removeState={removeState}
            key={state.type}
            statePosition={index}
            position={position}
            isPlayerCard={isPlayerCard}
            eventType="drawCard"
          />
        ))}
      </CaptureEvents>
    </div>
  );
}

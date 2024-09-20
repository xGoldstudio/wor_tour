import { useRef, useState } from "react";
import useGameInterface from "../stores/gameInterfaceStore";
import { AfterPlaceCardEvent, CardDestroyedEvent } from "game_engine";
import { cn, GameCard, useGameEventListener } from "@repo/ui";
import { Skull, Target } from "lucide-react";

interface CardPlaceholderProps {
  position: number;
  isPlayer: boolean;
}

export default function CardPlaceholder({ position, isPlayer }: CardPlaceholderProps) {
  const { setCardTarget, removeCardTarget, cardTarget, focusedCard } =
    useGameInterface();
  const isSelected = isPlayer && cardTarget === position;
  const [trackedInstanceId, setTrackedInstanceId] = useState<number | null>(
    null
  );
  const trackedInstanceIdRef = useRef<number | null>(null);

  useGameEventListener<AfterPlaceCardEvent>({
    type: "afterPlaceCard",
    action: (_, gameState) => {
      const instanceId =
        gameState.getCard(isPlayer, position)?.instanceId ?? null;
      setTrackedInstanceId(instanceId);
      trackedInstanceIdRef.current = instanceId;
    },
    filter: (event) =>
      event.position === position && event.isPlayer === isPlayer,
  });

  useGameEventListener<CardDestroyedEvent>({
    type: "cardDestroyed",
    action: () => {
      setTrackedInstanceId(null);
      trackedInstanceIdRef.current = null;
    },
    filter: (event) => event.instanceId === trackedInstanceIdRef.current,
  });

  function onEnter() {
    const cardSelected = useGameInterface.getState().cardSelected;
    if (!isPlayer || cardSelected === null) {
      return;
    }
    setCardTarget(position);
  }

  function onLeave() {
    const cardSelected = useGameInterface.getState().cardSelected;
    if (!isPlayer || cardSelected !== null) {
      removeCardTarget();
    }
  }

  return (
    <div
      className="p-1 border-2 rounded-md ring-2 ring-black w-[160px] h-[222.5px] box-content relative"
      style={{
        boxShadow: isSelected ? "0px 0px 5px 1px rgba(0,0,0,0.75)" : "none",
        borderColor: "#cbd5e1",
      }}
      id={getBoardTileId(!!isPlayer, position)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div id={`card_${isPlayer}_${position}`}>
        <GameCard isPlayerCard={isPlayer} position={position} />
      </div>
      <div
        className={cn(
          "w-full h-full opacity-0 absolute top-0 left-0 rounded-md flex justify-center items-center overflow-hidden",
          isSelected && trackedInstanceId !== null && "opacity-100"
        )}
      >
        <div className="bg-slate-800 bg-opacity-40 w-full h-full absolute" />
        <Skull size={96} />
      </div>
      <div
        className={cn(
          "w-full h-full opacity-0 absolute top-0 left-0 rounded-md flex justify-center items-center overflow-hidden transition-opacity",
          focusedCard !== null &&
            focusedCard === trackedInstanceId &&
            "opacity-100"
        )}
      >
        <div className="bg-sky-800 bg-opacity-40 w-full h-full absolute" />
        <Target size={96} />
      </div>
    </div>
  );
}

function getBoardTileId(isPlayer: boolean, position: number) {
  return `board_${isPlayer ? "player" : "opponent"}_${position}`;
}

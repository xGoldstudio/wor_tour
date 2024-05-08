import { useEffect, useRef, useState } from "react";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore from "@/stores/gameStateInterface";
import PlayerGUI from "./gui/PlayerGui";
import GameOverModal from "./GameOverModal";
import AnimationCanvas from "./AnimationCanvas";
import * as _ from "lodash";
import useGameEvents from "./gameBehavior/useGameEvents";

export default function Game() {
  const {
    playerMana,
    playerHp,
    playerMaxHp,
    opponentHp,
    opponentMana,
    opponentMaxHp,
    currentWinner,
  } = useGameStore();
  const { cardSelected, setCardTarget, removeCardTarget } = useGameInterface();
  const { userPlaceNewCard } = useGameEvents();

  function watchCardPlacement(event: MouseEvent) {
    const elementIds = _.range(3).map(position => getBoardTileId(true, position));
    const overlapped = document.elementsFromPoint(event.pageX, event.pageY);
    for (let i = 0; i < overlapped.length; i++) {
      if (overlapped[i].id.startsWith("board_player_")) {
        for (let y = 0; y < elementIds.length; y++) {
          if (overlapped[i].id === elementIds[y]) {
            setCardTarget(y);
            return;
          }
        }
      }
    }
    removeCardTarget();
  }

  useEffect(() => {
    if (cardSelected !== null) {
      window.addEventListener("mousemove", watchCardPlacement);
      return () => {
        window.removeEventListener("mousemove", watchCardPlacement);
      };
    }
  }, [cardSelected]);

  return (
    <div className="w-screen h-screen grid grid-cols-[1fr_auto_1fr] flex-col items-center bg-black">
      <GameOverModal currentWinner={currentWinner} />
      <div className="bg-black h-full w-full"></div>
      <div className="h-screen flex flex-col gap-4 justify-between relative bg-violet-400">
        <AnimationCanvas />
        <PlayerGUI
          mana={opponentMana}
          hp={opponentHp}
          maxHp={opponentMaxHp}
          isPlayer={false}
          userPlaceNewCard={userPlaceNewCard}
        />
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 gap-4 px-8">
            <CardPlaceholder position={0} />
            <CardPlaceholder position={1} />
            <CardPlaceholder position={2} />
            <CardPlaceholder position={0} isPlayer />
            <CardPlaceholder position={1} isPlayer />
            <CardPlaceholder position={2} isPlayer />
          </div>
        </div>
        <PlayerGUI
          mana={playerMana}
          hp={playerHp}
          maxHp={playerMaxHp}
          isPlayer
          userPlaceNewCard={userPlaceNewCard}
        />
      </div>
      <div className="bg-black h-full w-full"></div>
    </div>
  );
}

interface CardPlaceholderProps {
  position: number;
  isPlayer?: boolean;
}

function CardPlaceholder({ position, isPlayer }: CardPlaceholderProps) {
  const { cardTarget } = useGameInterface();
  const isTarget = cardTarget === position && isPlayer;
  const { getBoardCurrentCard } = useGameStore();
  const currentCard = getBoardCurrentCard(!!isPlayer, position);
  const attackRef = useRef<null | HTMLDivElement>(null);

  const [startAttackTimestamp, setStartAttackTimestamp] = useState(
    currentCard?.startAttackingTimestamp
  );

  if (
    startAttackTimestamp !== currentCard?.startAttackingTimestamp &&
    attackRef.current
  ) {
    setStartAttackTimestamp(currentCard?.startAttackingTimestamp);
  }

  useEffect(() => {
    if (!attackRef.current || !currentCard) {
      return;
    }
    attackRef.current.animate(
      [{ transform: "scaleX(0%)" }, { transform: "scaleX(100%)" }],
      1000 / currentCard.attackSpeed
    );
  }, [attackRef, startAttackTimestamp]);

  return (
    <div
      className="w-[192px] h-[192px] border-2 rounded-md ring-2 ring-black overflow-hidden"
      style={{
        boxShadow: isTarget ? "0px 0px 5px 1px rgba(0,0,0,0.75)" : "none",
        borderColor: currentCard ? "black" : "#cbd5e1",
      }}
      id={getBoardTileId(!!isPlayer, position)}
    >
      {currentCard ? (
        <div className="flex flex-col items-center h-full">
          <div className="grow flex items-center gap-1 justify-center relative w-full">
            <div
              className="absolute w-full h-full bg-slate-300 origin-left scale-x-0"
              ref={attackRef}
            />
            <p className="relative">{currentCard.dmg}</p>
            <img src="/sword.svg" height={14} width={14} className="relative" />
          </div>
          <div
            className="w-full h-[120px] border-y-[1px] border-black "
            style={{
              backgroundImage: `url('./${currentCard.id}.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="grow flex items-center bg-red-600 w-full justify-center text-white">
            {currentCard.hp}/{currentCard.maxHp}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export function getBoardTileId(isPlayer: boolean, position: number) {
  return `board_${isPlayer ? "player" : "opponent"}_${position}`;
}

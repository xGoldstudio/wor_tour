import { useEffect, useRef, useState } from "react";
import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import PlayerGUI from "./gui/PlayerGui";
import * as _ from "lodash";
import useGameEvents from "./gameBehavior/useGameEvents";
import GameDebugPanel from "./GameDebugPanel";
import GameCard from "./gui/card/GameCard";
import GameCardDeath from "./gui/card/GameCardDeath";

export default function Game() {
  const {
    playerMana,
    playerHp,
    playerMaxHp,
    opponentHp,
    opponentMana,
    opponentMaxHp,
  } = useGameStore();
  const { cardSelected, setCardTarget, removeCardTarget } = useGameInterface();
  const {
    userPlaceNewCard,
    togglePlay,
    isClockRunning,
    fastForward,
    gameRef,
    destroyGame,
    isInit,
  } = useGameEvents();

  useEffect(() => {
    function watchCardPlacement(event: MouseEvent) {
      const elementIds = _.range(3).map((position) =>
        getBoardTileId(true, position)
      );
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

    if (cardSelected !== null) {
      window.addEventListener("mousemove", watchCardPlacement);
      return () => {
        window.removeEventListener("mousemove", watchCardPlacement);
      };
    }
  }, [cardSelected, removeCardTarget, setCardTarget]);

  return (
    <div
      className="w-screen h-screen grid grid-cols-[1fr_auto_1fr] flex-col items-center bg-black"
      ref={gameRef}
    >
      <GameDebugPanel
        togglePlay={togglePlay}
        isClockRunning={isClockRunning}
        fastForward={fastForward}
        destroyGame={destroyGame}
      />
      {isInit && (
        <>
          <div className="bg-black h-full w-full"></div>
          <div className="h-screen flex flex-col gap-4 justify-between relative overflow-hidden w-[700px]">
            <div
              className="w-full h-full absolute blur-sm"
              style={{
                backgroundImage: "url('/bgTexture.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
            <PlayerGUI
              mana={opponentMana}
              hp={opponentHp}
              maxHp={opponentMaxHp}
              isPlayer={false}
              userPlaceNewCard={userPlaceNewCard}
            />
            <div className="w-full flex justify-center relative">
              <div className="grid grid-cols-3 gap-4 px-8">
                <CardPlaceholder position={0} isPlayer={false} />
                <CardPlaceholder position={1} isPlayer={false} />
                <CardPlaceholder position={2} isPlayer={false} />
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
        </>
      )}
    </div>
  );
}

interface CardPlaceholderProps {
  position: number;
  isPlayer: boolean;
}

function CardPlaceholder({ position, isPlayer }: CardPlaceholderProps) {
  const cardTarget = useGameInterface((s) => s.cardTarget);
  const isTarget = cardTarget === position && isPlayer;
  const getBoardCurrentCard = useGameStore((s) => s.getBoardCurrentCard);
  const currentCard = getBoardCurrentCard(!!isPlayer, position);
  const attackRef = useRef<null | HTMLDivElement>(null);

  const [startAttackTimestamp, setStartAttackTimestamp] = useState(
    currentCard?.startAttackingTick
  );

  if (
    startAttackTimestamp !== currentCard?.startAttackingTick &&
    attackRef.current
  ) {
    setStartAttackTimestamp(currentCard?.startAttackingTick);
  }

  useEffect(() => {
    if (!attackRef.current || !currentCard) {
      return;
    }
    attackRef.current.animate(
      [{ transform: "scaleX(0%)" }, { transform: "scaleX(100%)" }],
      1000 / currentCard.attackSpeed
    );
  }, [attackRef, currentCard, startAttackTimestamp]);

  return (
    <div
      className="p-1 border-2 rounded-md ring-2 ring-black w-[160px] h-[222.5px] box-content"
      style={{
        boxShadow: isTarget ? "0px 0px 5px 1px rgba(0,0,0,0.75)" : "none",
        borderColor: "#cbd5e1",
      }}
      id={getBoardTileId(!!isPlayer, position)}
    >
      <div id={`card_${isPlayer}_${position}`}>
        {currentCard ? (
          <GameCard
            card={currentCard}
            key={currentCard.instanceId}
            isPlayerCard={isPlayer}
            position={position}
          />
        ) : (
          <GameCardDeath isPlayerCard={isPlayer} position={position} />
        )}
      </div>
    </div>
  );
}

function getBoardTileId(isPlayer: boolean, position: number) {
  return `board_${isPlayer ? "player" : "opponent"}_${position}`;
}

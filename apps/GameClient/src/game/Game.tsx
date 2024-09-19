import useGameInterface from "@/game/stores/gameInterfaceStore";
import useRunGame from "./gameBehavior/useGameEvents";
import GameDebugPanel from "./GameDebugPanel";
import PlayerGUI from "./gui/PlayerGui";
import FlashDamage from "./FlashDamage";
import AmountEffectOrDamage from "./AmountEffectOrDamage";
import StartSequence from "./StartSequence";
import { cn, GameCard, useGameEventListener } from "@repo/ui";
import EndGameScreenWatcher from "./endGameScreen/EndGameScreenWatcher";
import { HomeBg } from "@/home/Home";
import { useRef, useState } from "react";
import { AfterPlaceCardEvent, CardDestroyedEvent } from "game_engine";
import { Skull, Target } from "lucide-react";
import { StatesHistory } from "@repo/ui";
import PlayerProfile from "./gui/PlayerProfile";

export default function Game() {
  const {
    gameRef,
    isInit,
    play,
    pause,
    isPlaying,
    runTicks,
    clock,
    gameState,
  } = useRunGame();
  const setFocusedCard = useGameInterface((state) => state.setFocusedCard);

  return (
    <div
      className="w-screen h-screen grid grid-cols-[1fr_auto_1fr] flex-col items-center bg-black"
      ref={gameRef}
    >
      <GameDebugPanel
        play={play}
        pause={pause}
        isPlaying={isPlaying}
        runTicks={runTicks}
        clock={clock}
      />
      {isInit && (
        <>
          <div className="h-screen w-screen relative overflow-hidden justify-center flex">
            <FlashDamage />
            <AmountEffectOrDamage />
            <StartSequence />
            <HomeBg />
            <div className="w-screen h-screen flex relative flex-col justify-between max-w-[900px]">
              <PlayerGUI isPlayer={false} clock={clock} gameState={gameState} />
              <div className="w-full flex justify-center items-center relative grow">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] translate-x-full">
                  <StatesHistory setFocusedCard={setFocusedCard} />
                </div>
                <div className="absolute top-0 left-0">
                  <PlayerProfile />
                </div>
                <div className="grid grid-cols-3 gap-4 px-8">
                  <CardPlaceholder position={0} isPlayer={false} />
                  <CardPlaceholder position={1} isPlayer={false} />
                  <CardPlaceholder position={2} isPlayer={false} />
                  <CardPlaceholder position={0} isPlayer />
                  <CardPlaceholder position={1} isPlayer />
                  <CardPlaceholder position={2} isPlayer />
                </div>
              </div>
              <PlayerGUI isPlayer clock={clock} gameState={gameState} />
            </div>
          </div>
        </>
      )}
      <EndGameScreenWatcher />
    </div>
  );
}

interface CardPlaceholderProps {
  position: number;
  isPlayer: boolean;
}

function CardPlaceholder({ position, isPlayer }: CardPlaceholderProps) {
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

import useGameInterface from "@/game/stores/gameInterfaceStore";
import useRunGame from "./gameBehavior/useGameEvents";
import GameDebugPanel from "./GameDebugPanel";
import PlayerGUI from "./gui/PlayerGui";
import FlashDamage from "./FlashDamage";
import AmountEffectOrDamage from "./AmountEffectOrDamage";
import StartSequence from "./StartSequence";
import EndGameScreenWatcher from "./endGameScreen/EndGameScreenWatcher";
import { HomeBg } from "@/home/Home";
import { StatesHistory } from "@repo/ui";
import PlayerProfile from "./gui/PlayerProfile";
import CardsBoard from "./gui/CardsBoard";

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
                <CardsBoard />
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

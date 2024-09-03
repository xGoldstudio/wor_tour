import { useState } from "react";
import iaAgent from "./aiAgent";
import { useOnUnMount, useRunGameInstance, FpsTracker } from "@repo/ui";
import { useGameEventListener, useOnMount } from "@repo/ui";
import { useShallow } from "zustand/react/shallow";
import useGameStore from "../stores/gameStateStore";
import useGameInterface from "../stores/gameInterfaceStore";
import useGameCanvas from "./animation/useGameCanvas";
import { ClockReturn, EventType, GameStateObject } from "game_engine";
import useGameMetadataStore from "../stores/gameMetadataStore";
import { matchmakingService } from "@/services/inject";

export const FRAME_TIME = 10;

interface GameEventsActions {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  runTicks: (amount: number) => void;
  gameRef: React.MutableRefObject<HTMLDivElement | null>;
  isInit: boolean;
  clock: ClockReturn<EventType>;
  gameState: GameStateObject;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}

export const GAME_OPTS = {
  simulateBadPerformance: false,
};

export const FPS_OBJ = FpsTracker();

function useRunGame(): GameEventsActions {
  const initGameStore = useGameStore((s) => s.init);
  const { init: initGameInterfaceStore } = useGameInterface(
    useShallow((state) => {
      return {
        init: state.init,
      };
    })
  );
  const [isInit, setIsInit] = useState(false);
  const { gameCanvas, gameRef } = useGameCanvas();
  const {
    clock,
    state: gameState,
    play,
    pause,
    isPlaying,
    runTicks,
  } = useRunGameInstance({
    animationsCompute: async (currentFrame: number) => {
      gameCanvas?.paint(currentFrame);
      if (GAME_OPTS.simulateBadPerformance) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 200)
        );
      }
    },
    gameData: useGameMetadataStore.getState().getInGameInitData(),
    fpsTracker: FPS_OBJ,
  });

  useOnMount(() => {
    initGameInterfaceStore({
      triggerEvent: clock.triggerEvent,
    });
    initGameStore(gameState);
    clock.triggerEvent({ type: "startGameSequence" });
    play();
    setIsInit(true);
  });

  useGameEventListener({
    type: "startGame",
    action: () => {
      iaAgent();
    },
  });

  useGameEventListener({
    type: "gameOver",
    action: (_, gameState) => {
      matchmakingService.endGame(gameState);
    },
  })

  useOnUnMount(() => {
    destroyGame();
  });

  function destroyGame() {
    setIsInit(false);
  }

  return {
    play,
    pause,
    isPlaying,
    runTicks,
    gameRef,
    isInit,
    clock,
    gameState,
  };
}

export default useRunGame;

import { useState } from "react";
import iaAgent from "./aiAgent";
import { useOnUnMount, useRunInstance, FpsTracker } from "@repo/ui";
import { useGameEventListener, useOnMount } from "@repo/ui";
import { useShallow } from "zustand/react/shallow";
import useGameStore from "../stores/gameStateStore";
import useGameInterface from "../stores/gameInterfaceStore";
import useGameCanvas from "./animation/useGameCanvas";
import { ClockReturn, EventType } from "game_engine";
import useGameMetadataStore from "../stores/gameMetadataStore";

export const FRAME_TIME = 10;

interface GameEventsActions {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  runTicks: (amount: number) => void;
  gameRef: React.MutableRefObject<HTMLDivElement | null>;
  isInit: boolean;
  clock: ClockReturn<EventType>;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}

export const GAME_OPTS = {
  simulateBadPerformance: false,
};

export const FPS_OBJ = FpsTracker();

function useGameEvents(): GameEventsActions {
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
  } = useRunInstance({
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
    // shuffleDeck(true); // todo
    // shuffleDeck(false);
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
  };
}

export default useGameEvents;

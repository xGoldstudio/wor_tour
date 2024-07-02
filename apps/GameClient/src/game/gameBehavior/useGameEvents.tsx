import { useEffect, useRef, useState } from "react";
import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore from "@/game/stores/gameStateStore";
import iaAgent from "./aiAgent";
import Clock, { ClockReturn } from "./clock/clock";
import GameCanvas, { GameCanvasReturn } from "./animation/gameCanvas";
import {
  resetAllGameEventListeners,
  runGameEventListeners,
} from "./gameEventListener";
import { CardEffects } from "@repo/types";
import { useOnMount, useOnUnMount } from "@repo/ui";
import { computeNextFrameState } from "./gameEngine/gameEngine";
import { useGameSyncAnimationStore } from "./animation/useGameSyncAnimation";
import { useShallow } from "zustand/react/shallow";
import useGameEventListener from "./useGameEventListener";
import { IS_DEBUG } from "@/isDebug";
import _ from "lodash";

export const FRAME_TIME = 10;

interface GameEventsActions {
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
  gameRef: React.MutableRefObject<HTMLDivElement | null>;
  isInit: boolean;
}

export type EventType =
  | StartGameSequence
  | StartGame
  | ManaIncreaseEvent
  | SetManaIncreaseSpeed
  | ManaConsumeEvent
  | PlaceCardEvent
  | StartEarningMana
  | CardStartAttackingEvent
  | CardAttackingEvent
  | PlayerDamageEvent
  | CardDamageEvent
  | CardDestroyedEvent
  | GameOverEvent
  | DrawCardEvent
  | HealCardEvent
  | RemoveEffectEvent
  | CardDamagResolveEvent
  | PlayerDamageResolveEvent;

export interface StartGameSequence {
  type: "startGameSequence";
}

export interface StartGame {
  type: "startGame";
}

export interface ManaConsumeEvent {
  type: "manaConsume";
  isPlayer: boolean;
  delta: number;
}

export interface StartEarningMana {
  type: "startEarningMana";
  isPlayer: boolean;
}

export interface SetManaIncreaseSpeed {
  type: "setManaIncreaseSpeed";
  isPlayer: boolean;
  speed: number;
}

export interface ManaIncreaseEvent {
  type: "manaIncrease";
  isPlayer: boolean;
}

export interface PlaceCardEvent {
  type: "placeCard";
  isPlayer: boolean;
  targetPosition: number;
  cardInHandPosition: number;
}

export interface CardStartAttackingEvent {
  type: "cardStartAttacking";
  isPlayer: boolean;
  cardPosition: number;
  instanceId: number;
}

export interface CardAttackingEvent {
  type: "cardAttacking";
  isPlayer: boolean;
  cardPosition: number;
  instanceId: number;
}

export interface PlayerDamageEvent {
  type: "playerDamage";
  isPlayer: boolean;
  damage: number;
  initiator: CardAttackingEvent;
}

export interface PlayerDamageResolveEvent {
  type: "playerDamageResolve";
  initiator: PlayerDamageEvent;
}

export interface CardDamageEvent {
  type: "cardDamage";
  amount: number;
  cardPosition: number;
  isPlayerCard: boolean;
  directAttack: boolean;
  initiator: {
    isPlayerCard: boolean;
    cardPosition: number;
  };
}

export interface CardDamagResolveEvent {
  type: "cardDamageResolve";
  initiator: CardDamageEvent;
}

export interface CardDestroyedEvent {
  type: "cardDestroyed";
  initiator: CardDamageEvent;
}

export interface GameOverEvent {
  type: "gameOver";
  winnerIsPlayer: boolean;
}

export interface DrawCardEvent {
  type: "drawCard";
  isPlayer: boolean;
  handPosition: number;
}

export interface HealCardEvent {
  type: "healCard";
  isPlayerCard: boolean;
  cardPosition: number;
  amount: number;
  cardInitiator: {
    isPlayerCard: boolean;
    cardPosition: number;
  };
}

export interface RemoveEffectEvent {
  type: "removeEffect";
  isPlayerCard: boolean;
  cardPosition: number;
  effectToRemove: keyof CardEffects;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}

// should be use only for debug
export let TriggerGameEvent: null | ((event: EventType) => void) = null;

export const GAME_OPTS = {
  simulateBadPerformance: false,
};

export const FPS_OBJ = {
  pointer: 0,
  array: _.fill(new Array<number>(100), 0),
  register(value: number) {
    this.array[this.pointer] = value;
    this.pointer = this.pointer === 99 ? 0 : this.pointer + 1;
  },
  getFps() {
    const total = this.array.reduce((acc, curr) => acc + curr, 0);
    return 1000 / (total / 100);
  }
}

// all game logic here
// todo to guaranteed fairness, we must wrap setTimeout in a custom gameLoop
function useGameEvents(): GameEventsActions {
  const initGameStore = useGameStore((s) => s.init);
  const {
    getData: getUserInterfaceData,
    isClockRunning,
    setIsClockRunning,
    init: initGameInterfaceStore,
  } = useGameInterface(
    useShallow((state) => {
      return {
        getData: state.getData,
        isClockRunning: state.isClockRunning,
        setIsClockRunning: state.setIsClockRunning,
        init: state.init,
      };
    })
  );
  const gameRef = useRef<null | HTMLDivElement>(null);
  const [clock] = useState<ClockReturn<EventType>>(() =>
    Clock(internalTriggerEvent)
  );
  const [gameCanvas] = useState<GameCanvasReturn>(() => GameCanvas());
  const { triggerGameSyncAnimation, reset: resetGameSyncAnimationStore } =
    useGameSyncAnimationStore();
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (gameRef.current) {
      gameCanvas?.append(gameRef.current);
    }
    return () => {};
  }, [gameCanvas]);

  useOnMount(() => {
    initGameInterfaceStore({
      triggerEvent,
    });
    initGameStore();
    // shuffleDeck(true); // todo
    // shuffleDeck(false);
    triggerEvent({ type: "startGameSequence" });
    resume();
    setIsInit(true);
    TriggerGameEvent = (event: EventType) => internalTriggerEvent(event, clock);
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
    // remove all events
    resetAllGameEventListeners();
    // stop the clock (tick still exist but will be gc, no next tick are going to be triggered)
    pause();
    gameCanvas.destroy();
    resetGameSyncAnimationStore();
    TriggerGameEvent = null;
  }

  const lastTickTiming = useRef<number | null>(null);

  function nextTick() {
    window.requestAnimationFrame(async () => {
      if (useGameStore.getState().state.currentWinner) {
        return;
      }
      const now = Date.now();
      const prev = lastTickTiming.current ?? now;
      
      const timeSinceLastTick = now - prev;
      const tickToDo = Math.floor(timeSinceLastTick / FRAME_TIME);
      lastTickTiming.current = prev + tickToDo * FRAME_TIME;
      if (tickToDo > 0 && getUserInterfaceData().isClockRunning) {
        for (let i = 0; i < tickToDo; i++) {
          triggerTickEffects(i === 0);
        }
      }
      if (GAME_OPTS.simulateBadPerformance) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));
      }
      if (IS_DEBUG()) {
        FPS_OBJ.register(timeSinceLastTick);
      }
      nextTick();
    });
  }

  function triggerTickEffects(shouldAnimate: boolean) {
    if (shouldAnimate) {
      const currentFrame = clock.getImmutableInternalState().currentFrame;
      gameCanvas?.paint(currentFrame);
      triggerGameSyncAnimation(useGameStore.getState().state, currentFrame);
    }
    clock.nextTick();
  }

  function resume() {
    setIsClockRunning(true);
    nextTick();
  }

  function pause() {
    setIsClockRunning(false);
  }

  function togglePlay() {
    if (!isClockRunning) {
      resume();
    } else {
      pause();
    }
  }

  function fastForward(amount: number) {
    for (let i = 0; i < amount; i++) {
      triggerTickEffects(i === 0);
    }
  }

  const triggerEvent = clock.triggerEvent;

  function internalTriggerEvent(
    event: EventType,
    clock: ClockReturn<EventType>
  ) {
    const { state: usingState } = useGameStore.getState();
    computeNextFrameState(usingState, event, clock);
    animationReactionToEvent(event);
    // we rerun getData to have the updated data
    useGameStore.setState({ state: usingState });
    runGameEventListeners(event.type, event, usingState, triggerEvent, clock);
  }

  function animationReactionToEvent(event: EventType) {
    if (event.type === "cardDamage") {
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayerCard}_${event.initiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "attack",
        clock.getImmutableInternalState().currentFrame
      );
    } else if (event.type === "playerDamage") {
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayer}_${event.initiator.cardPosition}`,
        `hpBar_${event.isPlayer}`,
        "attack",
        clock.getImmutableInternalState().currentFrame,
        {
          sameX: true,
        }
      );
    } else if (event.type === "healCard") {
      gameCanvas.newAnimation(
        `card_${event.cardInitiator.isPlayerCard}_${event.cardInitiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "heal",
        clock.getImmutableInternalState().currentFrame
      );
    }
  }

  return {
    togglePlay,
    isClockRunning,
    fastForward,
    gameRef,
    isInit,
  };
}

export function useTriggerEvent() {
  const { triggerEvent } = useGameInterface();
  return triggerEvent;
}

export default useGameEvents;

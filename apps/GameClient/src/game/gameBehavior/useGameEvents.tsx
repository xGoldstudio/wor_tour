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
import { defaultManaSpeed } from "./gameEngine/gameState";

export const FRAME_TIME = 10;

interface GameEventsActions {
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
  gameRef: React.MutableRefObject<HTMLDivElement | null>;
  isInit: boolean;
}

export type EventType =
  StartGameSequence
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
    const time = 30;
    triggerEvent({ type: "setManaIncreaseSpeed", isPlayer: true, speed: time });
    triggerEvent({ type: "startGameSequence" });
    clock.setGameEventTimeout({ type: "startEarningMana", isPlayer: true }, time);
    clock.setGameEventTimeout({ type: "startEarningMana", isPlayer: false }, time);
    clock.setGameEventTimeout({ type: "setManaIncreaseSpeed", isPlayer: true, speed: defaultManaSpeed }, time * 8);
    const drawCardTime = time * 8 / 5;
    for (let i = 0; i < 4; i++) {
      const delay = drawCardTime * (i + 1);
      clock.setGameEventTimeout({ type: "drawCard", isPlayer: true, handPosition: i }, delay);
      clock.setGameEventTimeout({ type: "drawCard", isPlayer: false, handPosition: i }, delay);
    }
    clock.setGameEventTimeout({ type: "startGame" }, time * 8);
    resume();
    setIsInit(true);
    iaAgent();
    TriggerGameEvent = (event: EventType) => internalTriggerEvent(event, clock);
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

  function nextTick() {
    setTimeout(() => {
      if (useGameStore.getState().state.currentWinner) {
        return;
      }
      if (getUserInterfaceData().isClockRunning) {
        triggerTickEffects();
        nextTick();
      }
    }, FRAME_TIME);
  }

  function triggerTickEffects() {
    const currentFrame = clock.getImmutableInternalState().currentFrame;
    gameCanvas?.paint(currentFrame);
    clock.nextTick();
    triggerGameSyncAnimation(useGameStore.getState().state, currentFrame);
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
      triggerTickEffects();
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

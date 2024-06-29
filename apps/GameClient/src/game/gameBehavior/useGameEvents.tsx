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
import { useOnMount } from "@repo/ui";
import { computeNextFrameState } from "./gameEngine/gameEngine";
import { useGameSyncAnimationStore } from "./animation/useGameSyncAnimation";

export const FRAME_TIME = 10;

export const manaSpeed = 1500;

interface GameEventsActions {
  userPlaceNewCard: (cardInHandPosition: number) => void;
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
  gameRef: React.MutableRefObject<HTMLDivElement | null>;
  destroyGame: () => void;
  isInit: boolean;
}

export type EventType =
  | ManaIncreaseEvent
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
  // | RemoveAnimationEvent
  | CardDamagResolveEvent
  | PlayerDamageResolveEvent;

export interface ManaConsumeEvent {
  type: "manaConsume";
  isPlayer: boolean;
  delta: number;
}

export interface StartEarningMana {
  type: "startEarningMana";
  isPlayer: boolean;
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

// export interface RemoveAnimationEvent {
//   type: "removeAnimation";
//   key: string;
// }

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
    removeCardTarget,
    init: initGameInterfaceStore,
  } = useGameInterface();
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
    initGameInterfaceStore();
    initGameStore();
    iaAgent();
    // shuffleDeck(true); // todo
    // shuffleDeck(false);
    triggerEvent({ type: "startEarningMana", isPlayer: true });
    triggerEvent({ type: "startEarningMana", isPlayer: false });
    // for (let i = 0; i < 7; i++) {
    //   triggerEvent({ type: "manaIncrease", isPlayer: false });
    //   triggerEvent({ type: "manaIncrease", isPlayer: false });
    // }
    for (let i = 0; i < 4; i++) {
      triggerEvent({ type: "drawCard", isPlayer: true, handPosition: i });
      triggerEvent({ type: "drawCard", isPlayer: false, handPosition: i });
    }
    resume();
    setIsInit(true);
    // setIsInteractive(true);
    TriggerGameEvent = (event: EventType) => internalTriggerEvent(event, clock);
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
    if (!usingState || usingState.currentWinner) {
      return;
    }
    computeNextFrameState(usingState, event, clock);
    animationReactionToEvent(event);
    // we rerun getData to have the updated data
    useGameStore.setState({ state: usingState });
    runGameEventListeners(event.type, event, usingState, triggerEvent, clock);
    if (event.type === "gameOver") {
      // is it necessary?
      destroyGame();
    }
  }

  function animationReactionToEvent(event: EventType) {
    if (event.type === "cardDamage") {
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayerCard}_${event.initiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "attack",
        clock.getImmutableInternalState().currentFrame
      );
    } else if (event.type === "placeCard") {
      // gsap.to(`#card_${event.isPlayer}_${event.targetPosition}`, {
      //   duration: 0.5,
      //   opacity: 1,
      // });
    } else if (event.type === "cardDestroyed") {
      // gsap.to(
      //   `#card_${event.initiator.isPlayerCard}_${event.initiator.cardPosition}`,
      //   {
      //     duration: 0.5,
      //     opacity: 0,
      //   }
      // );
      // addNewAnimation(
      //   getDeathAnimationKey(
      //     event.initiator.isPlayerCard,
      //     event.initiator.cardPosition
      //   ),
      //   {
      //     onTick: clock.getImmutableInternalState().currentFrame,
      //     animationDuration: 75,
      //     data: {
      //       card: getCardFromState(
      //         event.initiator.isPlayerCard,
      //         event.initiator.cardPosition,
      //         data
      //       )!,
      //     },
      //   }
      // );
      // destroyCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
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

  function placeNewCard(cardInHandPosition: number) {
    const state = useGameStore.getState().state;
    if (!state) {
      return;
    }
    const targetPosition = getUserInterfaceData().cardTarget;
    if (targetPosition === null) {
      return;
    }
    triggerEvent({
      type: "placeCard",
      isPlayer: true,
      targetPosition,
      cardInHandPosition: cardInHandPosition,
    });
    removeCardTarget();
  }

  return {
    userPlaceNewCard: placeNewCard,
    togglePlay,
    isClockRunning,
    fastForward,
    gameRef,
    destroyGame,
    isInit,
  };
}

export default useGameEvents;

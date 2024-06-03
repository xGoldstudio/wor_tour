import { useEffect, useRef, useState } from "react";
import useGameInterface from "@/game/stores/gameInterfaceStore";
import useGameStore, {
  GameAnimation,
  GameStore,
  getCardFromState,
  getHandFromState,
} from "@/game/stores/gameStateStore";
import iaAgent from "./aiAgent";
import cardAttacking from "./events/cardAttacking";
import cardPlacementEventManager from "./events/cardPlacement";
import Clock, { ClockReturn } from "./clock/clock";
import { useGameSyncAnimationStore } from "./animation/useGameSyncAnimation";
import GameCanvas, { GameCanvasReturn } from "./animation/gameCanvas";
import {
  resetAllGameEventListeners,
  runGameEventListeners,
} from "./gameEventListener";
import useGameMetadataStore from "../stores/gameMetadataStore";
import { CardEffects } from "@repo/types";
import { useOnMount } from "@repo/ui";

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
  | RemoveAnimationEvent
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
  cardId: number;
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

export interface RemoveAnimationEvent {
  type: "removeAnimation";
  key: string;
}

export function getDeathAnimationKey(isPlayerCard: boolean, position: number) {
  return `death_${isPlayerCard}_${position}`;
}
// all game logic here
// todo to guaranteed fairness, we must wrap setTimeout in a custom gameLoop
function useGameEvents(): GameEventsActions {
  const {
    init: initGameStore,
    increaseMana,
    getData,
    placeCardBoard,
    consumeMana,
    startEarningMana,
    dealDamageToPlayer,
    dealDamageToCard,
    destroyCard,
    setGameOver,
    getNextInstanceId,
    cardDeckToHand,
    cardHandToDeck,
    shuffleDeck,
    startAttacking,
    healCard,
    removeEffect,
    addAnimation,
    removeAnimation,
  } = useGameStore();
  const {
    getData: getUserInterfaceData,
    isClockRunning,
    setIsClockRunning,
    removeCardTarget,
    init: initGameInterfaceStore,
  } = useGameInterface();
  const { reset: resetMetadata } = useGameMetadataStore((state) => ({
    reset: state.reset,
  }));
  const gameRef = useRef<null | HTMLDivElement>(null);
  const [clock] = useState<ClockReturn<EventType>>(() =>
    Clock(internalTriggerEvent),
  );
  const [gameCanvas] = useState<GameCanvasReturn>(() => GameCanvas());
  const { triggerGameSyncAnimation, reset: resetGameSyncAnimationStore } =
    useGameSyncAnimationStore<GameStore & { currentTick: number }>();
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (gameRef.current) {
      gameCanvas?.append(gameRef.current);
    }
    return () => {};
  }, [gameCanvas]);

  useOnMount(() => {
    initGameStore();
    initGameInterfaceStore();

    iaAgent();
    shuffleDeck(true);
    shuffleDeck(false);
    triggerEvent({ type: "startEarningMana", isPlayer: true });
    triggerEvent({ type: "startEarningMana", isPlayer: false });
    for (let i = 0; i < 4; i++) {
      triggerEvent({ type: "drawCard", isPlayer: true, handPosition: i });
      triggerEvent({ type: "drawCard", isPlayer: false, handPosition: i });
    }
    resume();
    setIsInit(true);
  });

  function destroyGame() {
    setIsInit(false);
    // remove all events
    resetAllGameEventListeners();
    // stop the clock (tick still exist but will be gc, no next tick are going to be triggered)
    pause();
    gameCanvas.destroy();
    resetGameSyncAnimationStore();
    resetMetadata();
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
    triggerGameSyncAnimation({
      ...getData(),
      currentTick: currentFrame,
    });
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

  function internalTriggerEvent(event: EventType) {
    const data = getData();
    if (data.currentWinner) {
      // some events may be triggered after the end of the game due to timers
      return null;
    }
    if (event.type === "startEarningMana") {
      if (
        (event.isPlayer ? data.playerMana : data.opponentMana) < 9 &&
        (event.isPlayer
          ? data.playerTickStartEarningMana
          : data.opponentTickStartEarningMana) === null
      ) {
        increaseManaTimer(event.isPlayer);
      }
    } else if (event.type === "manaIncrease") {
      increaseMana(event.isPlayer);
      triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
    } else if (event.type === "manaConsume") {
      consumeMana(event.isPlayer, event.delta);
      triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
    } else if (event.type === "placeCard") {
      cardPlacementEventManager(
        event,
        data,
        triggerEvent,
        getNextInstanceId,
        placeCardBoard,
      );
    } else if (event.type === "cardStartAttacking") {
      const usingCard = event.isPlayer
        ? data.playerBoard[event.cardPosition]
        : data.opponentBoard[event.cardPosition];
      if (!usingCard) {
        return;
      }
      startAttackTimer({
        attackSpeed: usingCard.attackSpeed,
        cardPosition: event.cardPosition,
        instanceId: event.instanceId,
        isPlayer: event.isPlayer,
      });
    } else if (event.type === "cardAttacking") {
      cardAttacking(event, data, triggerEvent);
    } else if (event.type === "cardDamage") {
      // animation
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayerCard}_${event.initiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "attack",
        clock.getImmutableInternalState().currentFrame,
        {
          onAnimationEnd: () =>
            triggerEvent({ type: "cardDamageResolve", initiator: event }),
        },
      );
    } else if (event.type === "cardDamageResolve") {
      const isDead = dealDamageToCard(
        event.initiator.isPlayerCard,
        event.initiator.amount,
        event.initiator.cardPosition,
      );
      if (event.initiator.directAttack) {
        const card = (
          event.initiator.isPlayerCard ? data.playerBoard : data.opponentBoard
        )[event.initiator.cardPosition];
        if (card?.effects.fightBack) {
          // attack before destroying the card
          triggerEvent({
            // to avoid infinite ping pong
            type: "removeEffect",
            isPlayerCard: event.initiator.isPlayerCard,
            cardPosition: event.initiator.cardPosition,
            effectToRemove: "fightBack",
          });
          triggerEvent({
            type: "cardDamage",
            amount: card.dmg,
            cardPosition: event.initiator.initiator.cardPosition,
            isPlayerCard: event.initiator.initiator.isPlayerCard,
            initiator: event.initiator,
            directAttack: true,
          });
        }
      }
      if (isDead) {
        triggerEvent({
          type: "cardDestroyed",
          initiator: event.initiator,
        });
      }
    } else if (event.type === "cardDestroyed") {
      addNewAnimation(
        getDeathAnimationKey(
          event.initiator.isPlayerCard,
          event.initiator.cardPosition,
        ),
        {
          onTick: clock.getImmutableInternalState().currentFrame,
          animationDuration: 75,
          data: {
            card: getCardFromState(
              event.initiator.isPlayerCard,
              event.initiator.cardPosition,
              data,
            )!,
          },
        },
      );
      destroyCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
    } else if (event.type === "playerDamage") {
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayer}_${event.initiator.cardPosition}`,
        `hpBar_${event.isPlayer}`,
        "attack",
        clock.getImmutableInternalState().currentFrame,
        {
          onAnimationEnd: () =>
            triggerEvent({ type: "playerDamageResolve", initiator: event }),
          sameX: true,
        },
      );
    } else if (event.type === "playerDamageResolve") {
      dealDamageToPlayer(event.initiator.isPlayer, event.initiator.damage);
      if (
        (event.initiator.isPlayer ? data.playerHp : data.opponentHp) -
          event.initiator.damage <=
        0
      ) {
        triggerEvent({
          type: "gameOver",
          winnerIsPlayer: !event.initiator.isPlayer,
        });
      }
    } else if (event.type === "gameOver") {
      setGameOver(event.winnerIsPlayer);
      destroyGame();
    } else if (event.type === "drawCard") {
      if (getHandFromState(event.isPlayer, data)[event.handPosition] !== null) {
        cardHandToDeck(event.isPlayer, event.handPosition);
      }
      cardDeckToHand(event.isPlayer, event.handPosition);
    } else if (event.type === "healCard") {
      healCard(event.isPlayerCard, event.cardPosition, event.amount);
      gameCanvas.newAnimation(
        `card_${event.cardInitiator.isPlayerCard}_${event.cardInitiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "heal",
        clock.getImmutableInternalState().currentFrame,
      );
    } else if (event.type === "removeEffect") {
      removeEffect(
        event.isPlayerCard,
        event.cardPosition,
        event.effectToRemove,
      );
    } else if (event.type === "removeAnimation") {
      removeAnimation(event.key);
    }

    // we rerun getData to have the updated data
    runGameEventListeners(event.type, event, getData(), triggerEvent);
  }

  function addNewAnimation(key: string, animation: GameAnimation) {
    addAnimation(key, animation);
    clock.setGameEventTimeout(
      {
        type: "removeAnimation",
        key,
      },
      animation.animationDuration,
    );
  }

  function increaseManaTimer(isPlayer: boolean) {
    startEarningMana(isPlayer, clock.getImmutableInternalState().currentFrame);
    clock.setGameEventTimeout(
      {
        type: "manaIncrease",
        isPlayer,
      },
      manaSpeed / FRAME_TIME,
    );
  }

  function placeNewCard(cardInHandPosition: number) {
    const playerHand = getData().playerHand;
    const targetPosition = getUserInterfaceData().cardTarget;
    const handCard = playerHand[cardInHandPosition];
    if (targetPosition === null || handCard === null) {
      return;
    }
    triggerEvent({
      type: "placeCard",
      isPlayer: true,
      cardId: handCard,
      targetPosition,
      cardInHandPosition: cardInHandPosition,
    });
    removeCardTarget();
  }

  function startAttackTimer({
    attackSpeed,
    cardPosition,
    instanceId,
    isPlayer,
  }: {
    attackSpeed: number;
    cardPosition: number;
    isPlayer: boolean;
    instanceId: number;
  }) {
    startAttacking(
      isPlayer,
      cardPosition,
      clock.getImmutableInternalState().currentFrame,
    );
    clock.setGameEventTimeout(
      {
        type: "cardAttacking",
        isPlayer,
        instanceId,
        cardPosition,
      },
      1000 / attackSpeed / FRAME_TIME,
    );
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

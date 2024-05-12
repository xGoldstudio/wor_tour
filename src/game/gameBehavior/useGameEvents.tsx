import { useEffect, useRef } from "react";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore, {
  GameStore,
  getHandFromState,
} from "@/stores/gameStateInterface";
import iaAgent from "./iaAgent";
import cardAttacking from "./events/cardAttacking";
import cardPlacementEventManager from "./events/cardPlacement";
import { CardEffects } from "@/cards";
import Clock from "./clock/clock";
import { useGameSyncAnimationStore } from "./useGameSyncAnimation";
import { IS_DEBUG } from "../Game";

export const FRAME_TIME = 10;

export const manaSpeed = 1500;

interface GameEventsActions {
  userPlaceNewCard: (cardInHandPosition: number) => void;
  togglePlay: () => void;
  isClockRunning: boolean;
  fastForward: (amount: number) => void;
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
  | RemoveEffectEvent;

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
  effectToRemove: keyof CardEffects["effects"];
}

let gameEventListeners = initGameEventListeners();

export type TriggerEventType = (event: EventType) => void;

type GameEventListenerFunction = (
  e: EventType,
  data: GameStore,
  triggerEvent: (event: EventType) => void
) => void;

function initGameEventListeners() {
  return new Map<EventType["type"], GameEventListenerFunction[]>();
}

export function addGameEventListener(
  type: EventType["type"],
  action: GameEventListenerFunction,
  filter?: (event: EventType) => boolean
) {
  let existingEvents = gameEventListeners.get(type);
  const actionComputed: GameEventListenerFunction =
    filter === undefined
      ? action
      : (e, data, triggerEvent) => filter(e) && action(e, data, triggerEvent);
  existingEvents = existingEvents
    ? [...existingEvents, actionComputed]
    : [actionComputed];
  gameEventListeners.set(type, existingEvents);
}

function runGameEventListeners(
  type: EventType["type"],
  e: EventType,
  data: GameStore,
  triggerEvent: (event: EventType) => void
) {
  gameEventListeners.get(type)?.forEach((action: GameEventListenerFunction) => {
    action(e, data, triggerEvent);
  });
}

function resetAllGameEventListeners() {
  gameEventListeners = initGameEventListeners();
}

function timeDiff() {
  const time = new Date().getTime();

  return (shouldElapsed: number) => {
    const reallyElapsed = new Date().getTime() - time;
    console.log("difference: ", reallyElapsed - shouldElapsed, shouldElapsed, reallyElapsed);
  }
}

// all game logic here
// todo to guaranteed fairness, we must wrap setTimeout in a custom gameLoop
function useGameEvents(): GameEventsActions {
  const {
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
  } = useGameStore();
  const {
    getData: getUserInterfaceData,
    isClockRunning,
    setIsClockRunning,
  } = useGameInterface();
  const clock = useRef(Clock(internalTriggerEvent)).current;
  // const getTimeDiff = useRef(timeDiff()).current;

  useEffect(() => {
    iaAgent();
    shuffleDeck(true);
    shuffleDeck(false);
    triggerEvent({ type: "startEarningMana", isPlayer: true });
    triggerEvent({ type: "startEarningMana", isPlayer: false });
    for (let i = 0; i < 4; i++) {
      triggerEvent({ type: "drawCard", isPlayer: true, handPosition: i });
      triggerEvent({ type: "drawCard", isPlayer: false, handPosition: i });
    }
    nextTick();
  }, []);

  const triggerGameAnimation = useGameSyncAnimationStore<GameStore & { currentTick: number }>();

  function nextTick() {
    setTimeout(() => {
      if (getUserInterfaceData().isClockRunning) {
        clock.nextTick();
        nextTick();
        triggerGameAnimation({ ...getData(), currentTick: clock.getImmutableInternalState().currentFrame });
        // if (IS_DEBUG) {
        //   getTimeDiff(clock.getImmutableInternalState().currentFrame * FRAME_TIME);
        // }
      }
    }, FRAME_TIME);
  }

  function togglePlay() {
    if (!isClockRunning) {
      setIsClockRunning(true);
      nextTick();
    } else {
      setIsClockRunning(false);
    }
  }

  function fastForward(amount: number) {
    for (let i = 0; i < amount; i++) {
      clock.nextTick();
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
        placeCardBoard
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
      const isDead = dealDamageToCard(
        event.isPlayerCard,
        event.amount,
        event.cardPosition
      );
      if (event.directAttack) {
        const card = (
          event.isPlayerCard ? data.playerBoard : data.opponentBoard
        )[event.cardPosition];
        if (card?.effects.fightBack) {
          // attack before destroying the card
          triggerEvent({
            // to avoid infinite ping pong
            type: "removeEffect",
            isPlayerCard: event.isPlayerCard,
            cardPosition: event.cardPosition,
            effectToRemove: "fightBack",
          });
          triggerEvent({
            type: "cardDamage",
            amount: card.dmg,
            cardPosition: event.initiator.cardPosition,
            isPlayerCard: event.initiator.isPlayerCard,
            initiator: event,
            directAttack: true,
          });
        }
      }
      if (isDead) {
        triggerEvent({
          type: "cardDestroyed",
          initiator: event,
        });
      }
    } else if (event.type === "cardDestroyed") {
      destroyCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
    } else if (event.type === "playerDamage") {
      dealDamageToPlayer(event.isPlayer, event.damage);
      if (
        (event.isPlayer ? data.playerHp : data.opponentHp) - event.damage <=
        0
      ) {
        triggerEvent({ type: "gameOver", winnerIsPlayer: !event.isPlayer });
      }
    } else if (event.type === "gameOver") {
      setGameOver(event.winnerIsPlayer);
      resetAllGameEventListeners();
    } else if (event.type === "drawCard") {
      if (getHandFromState(event.isPlayer, data)[event.handPosition] !== null) {
        cardHandToDeck(event.isPlayer, event.handPosition);
      }
      cardDeckToHand(event.isPlayer, event.handPosition);
    } else if (event.type === "healCard") {
      healCard(event.isPlayerCard, event.cardPosition, event.amount);
    } else if (event.type === "removeEffect") {
      removeEffect(
        event.isPlayerCard,
        event.cardPosition,
        event.effectToRemove
      );
    }

    // we rerun getData to have the updated data
    runGameEventListeners(event.type, event, getData(), triggerEvent);
  }

  function increaseManaTimer(isPlayer: boolean) {
    startEarningMana(isPlayer, clock.getImmutableInternalState().currentFrame);
    clock.setGameEventTimeout(
      {
        type: "manaIncrease",
        isPlayer,
      },
      manaSpeed / FRAME_TIME
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
    startAttacking(isPlayer, cardPosition);
    clock.setGameEventTimeout(
      {
        type: "cardAttacking",
        isPlayer,
        instanceId,
        cardPosition,
      },
      1000 / attackSpeed / FRAME_TIME
    );
  }

  return {
    userPlaceNewCard: placeNewCard,
    togglePlay,
    isClockRunning,
    fastForward,
  };
}

export default useGameEvents;

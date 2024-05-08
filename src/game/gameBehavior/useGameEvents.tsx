import findCard from "@/cards";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore, {
  GameStore,
  InGameCardType,
} from "@/stores/gameStateInterface";
import { useEffect } from "react";
import iaAgent from "./iaAgent";
import cardAttacking from "./events/cardAttacking";

export const manaSpeed = 1500;

interface GameEventsActions {
  userPlaceNewCard: (cardInHandPosition: number) => void;
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
  | DrawCardEvent;

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
  initiator: CardAttackingEvent;
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
    startAttacking,
  } = useGameStore();
  const { getData: getUserInterfaceData } = useGameInterface();

  useEffect(() => {
    iaAgent();
  }, []);

  useEffect(() => {
    triggerEvent({ type: "startEarningMana", isPlayer: true });
    triggerEvent({ type: "startEarningMana", isPlayer: false });
    for (let i = 0; i < 4; i++) {
      triggerEvent({ type: "drawCard", isPlayer: true, handPosition: i });
      triggerEvent({ type: "drawCard", isPlayer: false, handPosition: i });
    }
  }, []);

  function triggerEvent(event: EventType) {
    const data = getData();
    if (data.currentWinner) {
      // some events may be triggered after the end of the game due to timers
      return null;
    }
    if (event.type === "startEarningMana") {
      if (
        (event.isPlayer ? data.playerMana : data.opponentMana) < 9 &&
        (event.isPlayer
          ? data.playerTimestampStartEarningMana
          : data.opponentTimestampStartEarningMana) === null
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
      const foundCard = findCard(event.cardId);
      const cardInGame: InGameCardType = {
        id: foundCard.id,
        maxHp: foundCard.hp,
        hp: foundCard.hp,
        dmg: foundCard.dmg,
        attackSpeed: foundCard.attackSpeed,
        startAttackingTimestamp: null,
        instanceId: getNextInstanceId(),
        effects: foundCard.effects || [],
      };
      triggerEvent({
        type: "manaConsume",
        isPlayer: event.isPlayer,
        delta: foundCard.cost,
      });
      placeCardBoard(event.isPlayer, event.targetPosition, cardInGame);
      triggerEvent({
        type: "cardStartAttacking",
        isPlayer: event.isPlayer,
        cardPosition: event.targetPosition,
        instanceId: cardInGame.instanceId,
      });
      triggerEvent({
        type: "drawCard",
        isPlayer: event.isPlayer,
        handPosition: event.cardInHandPosition,
      });
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
      cardHandToDeck(event.isPlayer, event.handPosition);
      cardDeckToHand(event.isPlayer, event.handPosition);
    }

    // we rerun getData to have the updated data
    runGameEventListeners(event.type, event, getData(), triggerEvent);
  }

  function increaseManaTimer(isPlayer: boolean) {
    startEarningMana(isPlayer);
    setTimeout(() => {
      triggerEvent({ type: "manaIncrease", isPlayer });
    }, manaSpeed);
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
    setTimeout(() => {
      triggerEvent({
        type: "cardAttacking",
        isPlayer,
        instanceId,
        cardPosition,
      });
    }, 1000 / attackSpeed);
  }

  return {
    userPlaceNewCard: placeNewCard,
  };
}

export default useGameEvents;

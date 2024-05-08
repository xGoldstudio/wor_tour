import findCard from "@/cards";
import { getRandomElement } from "@/lib/list";
import useGameInterface from "@/stores/gameInterfaceStore";
import useGameStore, { InGameCardType } from "@/stores/gameStateInterface";
import { useEffect } from "react";

export const manaSpeed = 3000;

interface GameEventsActions {
  userPlaceNewCard: (cardInHandPosition: number) => void;
}

type EventType =
  | ManaIncreaseEvent
  | ManaConsumeEvent
  | PlaceCardEvent
  | StartEarningMana
  | CardStartAttackingEvent
  | CardAttackingEvent
  | PlayerDamageEvent
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
  card: InGameCardType;
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

function initGameEventListeners() {
  return new Map<EventType["type"], ((e: EventType) => void)[]>();
}

export function addGameEventListener(
  type: EventType["type"],
  action: (e: EventType) => void
) {
  let existingEvents = gameEventListeners.get(type);
  existingEvents = existingEvents ? [...existingEvents, action] : [action];
  gameEventListeners.set(type, existingEvents);
}

function runGameEventListeners(type: EventType["type"], e: EventType) {
  gameEventListeners.get(type)?.forEach((action: (e: EventType) => void) => {
    action(e);
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
    setGameOver,
    getNextInstanceId,
    cardDeckToHand,
    cardHandToDiscard,
    shuffleDiscardToDeck,
    startAttacking,
  } = useGameStore();
  const { getData: getUserInterfaceData } = useGameInterface();

  useEffect(() => {
    triggerEvent({ type: "startEarningMana", isPlayer: true });
    triggerEvent({ type: "startEarningMana", isPlayer: false });
    for (let i = 0; i < 4; i++) {
      triggerEvent({ type: "drawCard", isPlayer: true, handPosition: i });
      // triggerEvent({ type: "drawCard", isPlayer: false, handPosition: i });
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
      placeCardBoard(event.isPlayer, event.targetPosition, event.card);
      triggerEvent({
        type: "cardStartAttacking",
        isPlayer: event.isPlayer,
        cardPosition: event.targetPosition,
        instanceId: event.card.instanceId,
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
      const attakerCard = event.isPlayer
        ? data.playerBoard[event.cardPosition]
        : data.opponentBoard[event.cardPosition];
      const defenseCard = event.isPlayer
        ? data.opponentBoard[event.cardPosition]
        : data.playerBoard[event.cardPosition];
      if (attakerCard === null || attakerCard.instanceId !== event.instanceId) {
        // if card destroyed or replaced during attack
        return;
      }
      if (defenseCard) {
        // triggerEvent({ type: "cardReceiveDamage", amount: attakerCard.dmg, cardPosition: event.cardPosition });
      } else {
        triggerEvent({
          type: "playerDamage",
          damage: attakerCard.dmg,
          isPlayer: !event.isPlayer,
					initiator: event,
        });
      }
      triggerEvent({
        type: "cardStartAttacking",
        isPlayer: event.isPlayer,
        cardPosition: event.cardPosition,
        instanceId: event.instanceId,
      });
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
      const hand = event.isPlayer ? data.playerHand : data.opponentHand;
      const deck = event.isPlayer ? data.playerDeck : data.opponentDeck;
      const choosenCard = getRandomElement(deck);

      if (hand[event.handPosition] !== null) {
        cardHandToDiscard(event.isPlayer, event.handPosition);
      }
      cardDeckToHand(event.isPlayer, choosenCard, event.handPosition);
      if (deck.length <= 1) {
        shuffleDiscardToDeck(event.isPlayer);
      }
    }

    runGameEventListeners(event.type, event);
  }

  function increaseManaTimer(isPlayer: boolean) {
    startEarningMana(isPlayer);
    setTimeout(() => {
      triggerEvent({ type: "manaIncrease", isPlayer });
    }, manaSpeed);
  }

  function userPlaceNewCard(cardInHandPosition: number) {
    const playerHand = getData().playerHand;
    const targetPosition = getUserInterfaceData().cardTarget;
    const handCard = playerHand[cardInHandPosition];
    if (targetPosition === null || handCard === null) {
      return;
    }
    const foundCard = findCard(handCard);
    const cardInGame: InGameCardType = {
      id: foundCard.id,
      maxHp: foundCard.hp,
      hp: foundCard.hp,
      dmg: foundCard.dmg,
      attackSpeed: foundCard.attackSpeed,
      startAttackingTimestamp: null,
      instanceId: getNextInstanceId(),
    };
    triggerEvent({
      type: "manaConsume",
      isPlayer: true,
      delta: foundCard.cost,
    });
    triggerEvent({
      type: "placeCard",
      isPlayer: true,
      card: cardInGame,
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
    userPlaceNewCard,
  };
}

export default useGameEvents;

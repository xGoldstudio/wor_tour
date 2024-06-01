import { getRandomElement } from "@/lib/list";
import {
  CardDestroyedEvent,
  EventType,
  ManaIncreaseEvent,
} from "./useGameEvents";
import { CardType, findCard } from "@/cards";
import * as _ from "lodash";
import { GameStore } from "@/game/stores/gameStateStore";
import { addGameEventListener } from "./gameEventListener";

export default function iaAgent() {
  let nextCardToUse: { position: number; card: CardType } | null = null;

  function setNextCardToUse(data: GameStore) {
    const position = getRandomElement(_.range(4));
    nextCardToUse = { position, card: findCard(data.opponentHand[position]!, 1) };
  }

  function getEmptyTarget(data: GameStore): number | null {
    const freeZone: number[] = [];
    data.opponentBoard.forEach((card, position) => {
      if (card === null) {
        freeZone.push(position);
      }
    });
    if (freeZone.length === 0) {
      return null;
    }
    return getRandomElement(freeZone);
  }

  function computeMove(
    _: EventType,
    data: GameStore,
    triggerEvent: (event: EventType) => void
  ) {
    if (nextCardToUse === null) {
      setNextCardToUse(data);
    }
    if (nextCardToUse && nextCardToUse.card.cost <= data.opponentMana) {
      const target = getEmptyTarget(data);
      if (target === null) {
        return;
      }
      triggerEvent({
        type: "placeCard",
        isPlayer: false,
        targetPosition: target,
        cardInHandPosition: nextCardToUse.position,
        cardId: nextCardToUse.card.id,
      });
      setNextCardToUse(data);
    }
  }

  addGameEventListener(
    "manaIncrease",
    computeMove,
    (event) => !(event as ManaIncreaseEvent).isPlayer
  );
  addGameEventListener(
    "cardDestroyed",
    computeMove,
    (event) => !(event as CardDestroyedEvent).initiator.isPlayerCard
  );

  // addGameEventListener("startEarningMana", (_, data, triggerEvent) => {
  //   // check if there is free place
  //   // we need to compute the urgency of the situation
  //   const freeZone: number[] = [];
  //   data.opponentBoard.forEach((card, position) => {
  //     if (card === null) {
  //       freeZone.push(position);
  //     }
  //   });
  //   if (freeZone.length === 0) {
  //     return;
  //   }

  //   let lowestCostCard: null | { position: number; cost: number; id: number } =
  //     null;
  //   data.opponentHand.forEach((cardId, position) => {
  //     if (cardId === null) {
  //       return;
  //     }
  //     const card = findCard(cardId);
  //     if (
  //       card.cost <= data.opponentMana &&
  //       (lowestCostCard === null || card.cost < lowestCostCard.cost)
  //     ) {
  //       lowestCostCard = { position, cost: card.cost, id: card.id };
  //     }
  //   });

  //   if (lowestCostCard === null) {
  //     return;
  //   }

  //   const target = getRandomElement(freeZone);
  //   triggerEvent({
  //     type: "placeCard",
  //     isPlayer: false,
  //     targetPosition: target,
  //     cardInHandPosition: lowestCostCard.position,
  //     cardId: lowestCostCard.id,
  //   });
  //   // 0
  //   // wait for mana
  //   // 1
  //   // wait for most expensive card
  //   // 2
  //   // place the second most expensive card
  //   // 3
  //   // place the first card possible

  //   // if (hp < player) 30/70 defense attack or 70/30
  //   // focus on defense
  //   // else
  //   // focus on attack (free zone)
  // });
}

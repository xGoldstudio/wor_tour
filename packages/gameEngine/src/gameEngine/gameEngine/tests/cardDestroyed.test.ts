import _ from "lodash";
import { GameStateObject } from "../gameState";
import { EventType } from "../../../types/eventType";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { getInstanceId } from "./common";

const baseCard = {
  name: "string",
  cost: 1,
  illustration: "string",
  worldIllustration: "string",
  dmg: 100,
  hp: 200,
  attackSpeed: 1,
  states: [],
  level: 1,
  world: 1,
}

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common"}));

test("destroying player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.playerBoard[0]).toBe(null);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.playerBoard[0]?.id).toBe(0);
	clock.triggerEvent({ type: "cardDestroyed", initiator: {
		type: "cardDamage",
		amount: 0,
		instanceId: getInstanceId(state, true, 0),
		cardPosition: 0,
		isPlayerCard: true,
		directAttack: false,
		initiator: {
			type: "cardAttacking",
			instanceId: -1,
			isPlayer: false,
			cardPosition: 0,
		}
	} });
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});

test("destroying opponent card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.opponentBoard[0]).toBe(null);
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.opponentBoard[0]?.id).toBe(0);
	clock.triggerEvent({ type: "cardDestroyed", initiator: {
		type: "cardDamage",
		amount: 0,
		cardPosition: 0,
		instanceId: getInstanceId(state, false, 0),
		isPlayerCard: false,
		directAttack: false,
		initiator: {
			type: "cardAttacking",
			instanceId: -1,
			isPlayer: true,
			cardPosition: 0,
		}
	} });
	clock.nextTick();
	expect(state.opponentBoard[0]).toBe(null);
});
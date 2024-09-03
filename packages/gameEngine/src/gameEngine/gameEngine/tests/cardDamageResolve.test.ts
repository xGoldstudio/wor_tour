import _ from "lodash";
import { GameStateObject } from "../gameState";
import { EventType } from "../../../types/eventType";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { drawPlaceCard, triggerDirectAttackResolved } from "./common";

const baseCard = {
	name: "string",
	cost: 1,
	illustration: "string",
	worldIllustration: "string",
	dmg: 100,
	hp: 200,
	attackSpeed: 1,
	level: 1,
	world: 1,
}

const deck: CardType[] = _.times(8, (i) => ({
	...baseCard, id: i, rarity: "common", states: [],
}));

test("damage and kill player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	const playerInstanceId = state.playerBoard[0]!.instanceId;
	triggerDirectAttackResolved(clock, state, playerInstanceId, playerInstanceId, 100);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(100);
	// now kill the card
	triggerDirectAttackResolved(clock, state, playerInstanceId, playerInstanceId, 100);
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});


test("damage and kill opponent card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	drawPlaceCard(clock, false, 0, state);
	clock.nextTick();
	const opponentInstanceId = state.opponentBoard[0]!.instanceId;
	// deal damage to card
	triggerDirectAttackResolved(clock, state, opponentInstanceId, opponentInstanceId, 100);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(100);
	// now kill the card
	triggerDirectAttackResolved(clock, state, opponentInstanceId, opponentInstanceId, 100);
	clock.nextTick();
	expect(state.opponentBoard[0]).toBe(null);
});
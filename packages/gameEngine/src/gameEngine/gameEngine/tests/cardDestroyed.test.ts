import _ from "lodash";
import { GameStateObject } from "../gameState";
import { EventType } from "../../../types/eventType";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { drawPlaceCard, triggerKillCard } from "./common";

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

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

test("destroying player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	expect(state.playerBoard[0]).toBe(null);
	drawPlaceCard(clock, true, 0);
	clock.nextTick();
	expect(state.playerBoard[0]?.id).toBe(0);
	triggerKillCard(clock, state.playerBoard[0]!.instanceId);
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});

test("destroying opponent card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	expect(state.opponentBoard[0]).toBe(null);
	drawPlaceCard(clock, false, 0);
	clock.nextTick();
	expect(state.opponentBoard[0]?.id).toBe(0);
	triggerKillCard(clock, state.opponentBoard[0]!.instanceId);
	clock.nextTick();
	expect(state.opponentBoard[0]).toBe(null);
});
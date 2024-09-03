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

test("removing effect player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	const playerCardInstanceId = state.playerBoard[0]!.instanceId;
	// deal damage to card
	triggerDirectAttackResolved(clock, state, playerCardInstanceId, playerCardInstanceId, 100);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(100);
	// heal card
	function healCard(amount: number) {
		clock.triggerEvent({
			type: "healCard",
			amount: amount,
			instanceId: playerCardInstanceId,
			cardInitiatorInstanceId: playerCardInstanceId,
		});
	}
	healCard(50);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(150);
	healCard(10);
	healCard(10);
	clock.nextTick();
	healCard(10);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(180);
	// no overflow
	healCard(500);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(200);
});
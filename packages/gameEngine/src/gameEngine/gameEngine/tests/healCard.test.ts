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
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, position: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// deal damage to card
	clock.triggerEvent({ type: "cardDamageResolve", initiator: {
		type: "cardDamage",
		isPlayerCard: true,
		cardPosition: 0,
		directAttack: false,
		amount: 100,
		instanceId: getInstanceId(state, true, 0),
		initiator: {
			type: "cardAttacking",
			isPlayer: false,
			cardPosition: 0,
			instanceId: 0,
		},
	} });
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(100);
	// heal card
	function healCard(amount: number) {
		clock.triggerEvent({
			type: "healCard",
			isPlayerCard: true,
			cardPosition: 0,
			amount: amount,
			cardInitiator: {
				isPlayerCard: true,
				cardPosition: 1,
			},
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
import { DAMAGE_SPEED } from "../events/cardDamage";
import { initTest } from "./common";
import { expect, test } from 'vitest';

test("start damage to card (animation placeholder)", () => {
	const { clock, state } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// deal damage to player
	function dealDamageToCard(amount: number) {
		clock.triggerEvent({
			type: "cardDamage",
			isPlayerCard: true,
			cardPosition: 0,
			directAttack: false,
			amount: amount,
			initiator: {
				isPlayerCard: false,
				cardPosition: 0,
			},
		});
	}
	dealDamageToCard(10);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(200);
	for (let i = 0; i < DAMAGE_SPEED - 1; i++) {
		clock.nextTick();
	}
	expect(state.playerBoard[0]?.hp).toBe(200);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(190);
});

test("start damage to card (animation placeholder)", () => {
	const { clock, state } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// deal damage to player
	function dealDamageToCard(amount: number) {
		clock.triggerEvent({
			type: "cardDamage",
			isPlayerCard: false,
			cardPosition: 0,
			directAttack: false,
			amount: amount,
			initiator: {
				isPlayerCard: true,
				cardPosition: 0,
			},
		});
	}
	dealDamageToCard(10);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(200);
	for (let i = 0; i < DAMAGE_SPEED - 1; i++) {
		clock.nextTick();
	}
	expect(state.opponentBoard[0]?.hp).toBe(200);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(190);
});
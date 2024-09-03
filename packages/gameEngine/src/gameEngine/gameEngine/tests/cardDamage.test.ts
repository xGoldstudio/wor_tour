import { DAMAGE_SPEED } from "../events/cardDamage";
import { drawPlaceCard, getInstanceId, initTest } from "./common";
import { expect, test } from 'vitest';

test("start damage to card (animation placeholder)", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	// deal damage to player
	function dealDamageToCard(amount: number) {
		clock.triggerEvent({
			type: "cardDamage",
			instanceId: getInstanceId(state, true, 0),
			directAttack: false,
			amount: amount,
			cardInitiator: state.playerBoard[0]!,
			onDirectHitStates: [],
			initiator: {
				type: "cardAttacking",
				instanceId: 0,
				cardIniator: state.opponentBoard[0]!,
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
	const { clock, state } = initTest({ skipStartGame : true });
	drawPlaceCard(clock, false, 0, state);
	clock.nextTick();
	// deal damage to player
	function dealDamageToCard(amount: number) {
		clock.triggerEvent({
			type: "cardDamage",
			instanceId: getInstanceId(state, false, 0),
			directAttack: false,
			amount: amount,
			cardInitiator: state.playerBoard[0]!,
			onDirectHitStates: [],
			initiator: {
				type: "cardAttacking",
				instanceId: 0,
				cardIniator: state.opponentBoard[0]!,
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
import { bleedingStateTest, drawPlaceCard, getInstanceId, initTest } from "./common";
import { describe, expect, test } from 'vitest';

describe("bleeding state", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	clock.triggerEvent({ type: "addState", instanceId: getInstanceId(state, true, 0), state: bleedingStateTest });
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "bleeding")).toBeDefined();
	const hpBefore = state.playerBoard[0]!.hp;
	clock.triggerEvent({ type: "cardAttacking", instanceId: getInstanceId(state, true, 0), cardIniator: state.playerBoard[0]! });
	clock.nextTick();

	test("should take damage when attack", () => {
		expect(state.getCard(true, 0)!.hp).toBe(hpBefore - bleedingStateTest.value!);
	});

	test("damage come from itself and not direct attack", () => {
		expect(clock.getLastTickEvents().find(
			e => e.type === "cardDamageResolve"
				&& e.initiator.amount === bleedingStateTest.value
				&& e.initiator.directAttack === false
				&& e.initiator.initiator.instanceId === getInstanceId(state, true, 0)
		)).toBeDefined();
	});
});

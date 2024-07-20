import { bleedingStateTest, drawPlaceCard, initTest } from "./common";
import { describe, expect, test } from 'vitest';

describe("bleeding state", () => {
	const { clock, state } = initTest({});
	drawPlaceCard(clock, true, 0);
	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: bleedingStateTest });
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "bleeding")).toBeDefined();
	const hpBefore = state.playerBoard[0]!.hp;
	clock.triggerEvent({ type: "cardAttacking", isPlayer: true, cardPosition: 0, instanceId: state.playerBoard[0]!.instanceId });
	clock.nextTick();

	test("should take damage when attack", () => {
		expect(state.getCard(true, 0)!.hp).toBe(hpBefore - bleedingStateTest.value!);
	});

	test("damage come from itself and not direct attack", () => {
		expect(clock.getLastTickEvents().find(
			e => e.type === "cardDamageResolve"
				&& e.initiator.amount === bleedingStateTest.value
				&& e.initiator.directAttack === false
				&& e.initiator.initiator.instanceId === state.playerBoard[0]!.instanceId
		)).toBeDefined();
	});
});

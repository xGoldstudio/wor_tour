import { defaultTestHp, drawPlaceCard, findStateByType, initTest, massacreStateTest, triggerDirectAttackResolved } from "./common";
import { describe, expect, test } from 'vitest';

describe("bleeding state", () => {
	const { clock, state } = initTest({});
	drawPlaceCard(clock, true, 0);
	drawPlaceCard(clock, false, 0);
	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: massacreStateTest });
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "massacre")).toBeDefined();

	const damage = 10;
	triggerDirectAttackResolved(clock, state, true, 0, damage);
	clock.nextTick();

	test("should have added bleeding state", () => {
		expect(state.getCard(false, 0)!.hp).toBe(defaultTestHp - damage);
		const massacreState = findStateByType(state, false, 0, "bleeding");
		expect(massacreState).toBeDefined();
		expect(massacreState?.value).toBe(massacreStateTest.value);
	});

	test("bleeding state should have been stacked", () => {
		triggerDirectAttackResolved(clock, state, true, 0, damage);
		triggerDirectAttackResolved(clock, state, true, 0, damage);
		triggerDirectAttackResolved(clock, state, true, 0, damage);
		clock.nextTick();
		const massacreState = state.getStateOfCard(false, 0, "bleeding");
		expect(massacreState?.value).toBe(massacreStateTest!.value! * 4);
	});
});

import { baseCard, defaultTestHp, drawPlaceCard, findStateByType, getInstanceId, initTest, massacreStateTest, triggerDirectAttack } from "./common";
import { describe, expect, test } from 'vitest';

describe("bleeding state", () => {
	const damage = 10;
	const { clock, state } = initTest({ gameData: { playerDeck: [{...baseCard, dmg: damage}] },skipStartGame: true });
	drawPlaceCard(clock, true, 0);
	drawPlaceCard(clock, false, 0);
	clock.nextTick();
	clock.triggerEvent({ type: "addState", instanceId: getInstanceId(state, true, 0), isPlayerCard: true, position: 0, state: massacreStateTest });
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "massacre")).toBeDefined();

	triggerDirectAttack(clock, state, true, 0, true);
	clock.nextTick();

	test("should have added bleeding state", () => {
		expect(state.getCard(false, 0)!.hp).toBe(defaultTestHp - damage);
		const bleedingState = findStateByType(state, false, 0, "bleeding");
		expect(bleedingState).toBeDefined();
		expect(bleedingState?.value).toBe(massacreStateTest.value);
	});

	test("bleeding state should have been stacked", () => {
		triggerDirectAttack(clock, state, true, 0, true);
		triggerDirectAttack(clock, state, true, 0, true);
		triggerDirectAttack(clock, state, true, 0, true);
		clock.nextTick();
		const bleedingState = findStateByType(state, false, 0, "bleeding");
		expect(bleedingState?.value).toBe(massacreStateTest!.value! * 4);
	});
});

import { attackAnimation, baseCard, defaultTestHp, drawPlaceCard, findStateByType, getInstanceId, initGame, massacreStateTest, triggerDirectAttack } from "./common";
import { describe, expect, test } from 'vitest';

describe("bleeding state", () => {
	const damage = 10;
	const { clock, state } = initGame({ gameData: { playerDeck: [{ ...baseCard, dmg: damage, attackSpeed: 0 }] }, skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	drawPlaceCard(clock, false, 0, state);
	clock.nextTick();
	clock.triggerEvent({ type: "addState", instanceId: getInstanceId(state, true, 0), state: massacreStateTest });
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

	test("bleeding state should have been updated by the strength of massacre at the time of the attack", () => {
		triggerDirectAttack(clock, state, true, 0);
		clock.triggerEvent({ type: "increaseStateValue", instanceId: getInstanceId(state, true, 0), stateType: "massacre", increaseBy: 10 });
		// then we update the massacre strength
		attackAnimation(clock);
		clock.nextTick();
		const bleedingState = findStateByType(state, false, 0, "bleeding");
		expect(bleedingState?.value).toBe(massacreStateTest.value! * 5);
	});

	test("bleeding state should have been updated by the strength of massacre at the time of the attack (this time we update state first)", () => {
		triggerDirectAttack(clock, state, true, 0);
		// then we update the massacre strength
		attackAnimation(clock);
		clock.nextTick();
		const bleedingState = findStateByType(state, false, 0, "bleeding");
		expect(bleedingState?.value).toBe(massacreStateTest.value! * 7); // 1+1+3+(2)
	});
});

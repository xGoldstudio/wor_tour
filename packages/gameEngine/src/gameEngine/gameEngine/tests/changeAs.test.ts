import { describe, expect, test } from "vitest";
import { drawPlaceCard, initTest, triggerChangeAttackSpeed } from "./common";

describe("increase as", () => {
	const { clock, state } = initTest({
		skipStartGame: true, log: false, gameData: {
			opponentHp: 5000,
		}
	});
	drawPlaceCard(clock, true, 0);
	clock.nextTick();

	test("normal as", () => {

		expect(state.getCard(true, 0)?.startAttackingTick).toBe(0);
		for (let i = 0; i < 100; i++) {
			clock.nextTick();
		} // classic attack
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(100);
		for (let i = 0; i < 49; i++) {
			clock.nextTick();
		} // go half the attack
	})
	const instanceId = state.getCard(true, 0)!.instanceId;

	test("increase as by 100%", () => {
		triggerChangeAttackSpeed(clock, instanceId, 100);
		clock.nextTick();
		// attack is increased by 100%
		// progress is still 50% + 1frame (25 remaining)
		// startAttackingTick should change to fit the new attack speed
		expect(state.getCard(true, 0)?.attackSpeed).toBe(2);
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(125);
		expect(state.getCard(true, 0)?.endAttackingTick).toBe(175);
		for (let i = 0; i < 25; i++) {
			clock.nextTick();
		} // go to 100%
		expect(clock.getLastTickEvents().find((e) => e.type === "cardAttacking")).toBeTruthy();
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(175); // attack has been triggered 
		for (let i = 0; i < 25; i++) {
			clock.nextTick();
		} // go to 100%
		expect(clock.getLastTickEvents().find((e) => e.type === "cardAttacking")).toBeFalsy();
		for (let i = 0; i < 25; i++) {
			clock.nextTick();
		} // go to 50% (250)
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(225);
		expect(state.getCard(true, 0)?.endAttackingTick).toBe(275);
	});

	test("decrease as by 50%", () => {
		for (let i = 0; i < 25; i++) {
			clock.nextTick();
		} // go to 50% (250)
		triggerChangeAttackSpeed(clock, instanceId, -50); // reduce by 50%
		clock.nextTick();
		// attack is reduced by 50%
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(199); // due to rounding
		expect(state.getCard(true, 0)?.endAttackingTick).toBe(299);
	});
});
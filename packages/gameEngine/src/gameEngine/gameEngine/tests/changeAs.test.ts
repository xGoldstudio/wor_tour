import { describe, expect, test } from "vitest";
import { drawPlaceCard, initTest, triggerChangeAttackSpeed } from "./common";
import { MAX_ATTACK_SPEED, MIN_ATTACK_SPEED } from "../gameState";

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

	test("increase again by 20%", () => {
		triggerChangeAttackSpeed(clock, instanceId, 20);
		clock.nextTick();
		expect(state.getCard(true, 0)?.attackSpeed).toBe(2.2);
		expect(state.getCard(true, 0)?.startAttackingTick).toBe(226);
		expect(state.getCard(true, 0)?.endAttackingTick).toBe(271);
	});

	test("decrease as by 120%", () => { // = back to normal
		for (let i = 0; i < 25; i++) {
			clock.nextTick();
		} // go to 50% (250)
		triggerChangeAttackSpeed(clock, instanceId, -120); // reduce by 50%
		clock.nextTick();
		const card = state.getCard(true, 0);
		expect(card?.attackSpeed).toBe(card?.initialAttackSpeed);
		// attack is reduced by 50%
		expect(card?.startAttackingTick).toBe(195); // due to rounding
		expect(card?.endAttackingTick).toBe(295);
	});
});


test("AS limits upper and lower", () => {
	const { clock, state } = initTest({ skipStartGame: true  });
	drawPlaceCard(clock, true, 0);
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	triggerChangeAttackSpeed(clock, instanceId, 99999);
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.attackSpeed).toBe(MAX_ATTACK_SPEED); // max is 3
	expect(state.getCardByInstance(instanceId)?.modifierOfAttackSpeedPercentage).toBe(99999);
	clock.nextTick();
	triggerChangeAttackSpeed(clock, instanceId, -999999);
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.attackSpeed).toBe(MIN_ATTACK_SPEED); // min is 0.1
	expect(state.getCardByInstance(instanceId)?.modifierOfAttackSpeedPercentage).toBe(-900000);
});
import { expect, test } from "vitest";
import { drawPlaceCard, initTest } from "./common";
import { ClockReturn } from "../../clock/clock";
import { EventType } from "../../../types/eventType";

function triggerIncreaseAttackSpeed(clock: ClockReturn<EventType>, instanceId: number, percentage: number) {
	clock.triggerEvent({ type: "increaseAttackSpeed", instanceId, increasePercent: percentage });
}

test("increase as", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0);
	clock.nextTick();
	expect(state.getCard(true, 0)?.startAttackingTick).toBe(0);
	for (let i = 0; i < 100; i++) {
		clock.nextTick();
	} // classic attack
	expect(state.getCard(true, 0)?.startAttackingTick).toBe(100);
	for (let i = 0; i < 49; i++) {
		clock.nextTick();
	} // go half the attack
	const instanceId = state.getCard(true, 0)!.instanceId;
	triggerIncreaseAttackSpeed(clock, instanceId, 100);
	clock.nextTick();
	// attack is increased by 100%
	// progress is still 50% + 1frame (25 remaining)
	// startAttackingTick should change to fit the new attack speed
	expect(state.getCard(true, 0)?.attackSpeed).toBe(2);
	expect(state.getCard(true, 0)?.startAttackingTick).toBe(125);
	for (let i = 0; i < 25; i++) {
		clock.nextTick();
	} // go to 100%
	// expect(clock.getLastTickEvents().find((e) => e.type === "cardAttacking")).toBeTruthy();
	expect(state.getCard(true, 0)?.startAttackingTick).toBe(175); // attack has been triggered 
});
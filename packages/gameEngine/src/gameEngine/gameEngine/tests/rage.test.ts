import { describe, expect, test } from "vitest";
import { drawPlaceCard, initTest, rageStateTest } from "./common";
import { CardState } from "@repo/lib";

// max stacking already test,
// decay is already tested
// we have to test as change value

describe("rage", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0);
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;

	test("normal as", () => {
		expect(state.getCard(true, 0)?.attackSpeed).toBe(1);
	});

	test("added rage", () => {
		clock.triggerEvent({
			type: "addState",
			instanceId,
			state: { ...rageStateTest, value: 50 } as CardState,
		});
		clock.nextTick();
		const card = state.getCardInstance(instanceId);
		expect(card?.attackSpeed).toBe(1.5);
		expect(clock.getLastTickEvents().find(e => e.type === "changeAttackSpeed")?.changePercent).toBe(50);
	});

	test("change value rage", () => {
		clock.triggerEvent({
			type: "addState",
			instanceId,
			state: { ...rageStateTest, value: 100 } as CardState,
		});
		clock.nextTick();
		const card = state.getCardInstance(instanceId);
		expect(card?.attackSpeed).toBe(2);
		expect(card?.modifierOfAttackSpeedPercentage).toBe(100);
		// as increase by 50 to a total of 100
		expect(clock.getLastTickEvents().find(e => e.type === "changeAttackSpeed")?.changePercent).toBe(50);
	});

	test("remove rage", () => {
		clock.triggerEvent({
			type: "beforeRemoveState",
			instanceId,
			stateType: "rage",
		});
		clock.nextTick();
		const card = state.getCardInstance(instanceId);
		expect(card?.attackSpeed).toBe(1);
		expect(clock.getLastTickEvents().find(e => e.type === "changeAttackSpeed")?.changePercent).toBe(-100);
	});
})
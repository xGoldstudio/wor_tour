import { describe, expect, test } from "vitest";
import { baseCard, dummyStateTest, initTest, } from "./common";
import { CardState } from "@repo/lib";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
describe("addDeckCardStateValue", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [baseCard] } });
	const instanceId = state.playerDeck[0]!.id;

	test("adding state", () => {
		clock.triggerEvent({ type: "addDeckCardStateValue", instanceId, state: dummyStateTest });
		clock.nextTick();
		expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value);
	});

	test("no stacking", () => {
		clock.triggerEvent({ type: "addDeckCardStateValue", instanceId, state: dummyStateTest });
		clock.nextTick();
		expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value);
	});

	test("replace state correctly", () => {
		const value = 2;
		clock.triggerEvent({ type: "addDeckCardStateValue", instanceId, state: { ...dummyStateTest, value: value } as CardState });
		clock.nextTick();
		expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(value);
	});
});
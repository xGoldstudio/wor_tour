import { describe, expect, test } from "vitest";
import { baseCard, dummyStateTest, initTest, } from "./common";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
describe("addDeckCardStateValue", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [baseCard] } });
	const instanceId = state.playerDeck[0]!.id;

	test("adding state", () => {
		clock.triggerEvent({ type: "addDeckCardState", instanceId, state: dummyStateTest });
		clock.nextTick();
		expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value);
	});

	test("normal stacking", () => {
		clock.triggerEvent({ type: "addDeckCardState", instanceId, state: dummyStateTest });
		clock.nextTick();
		expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value! * 2);
	});
});
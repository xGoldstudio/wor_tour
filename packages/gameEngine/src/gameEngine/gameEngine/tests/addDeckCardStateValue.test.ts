import { describe, expect, test } from "vitest";
import { baseCard, dummyStateTest, initGame, } from "./common";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
describe("addDeckCardStateValue", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerDeck: [baseCard] } });
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

test("removeDeckCardStateValue", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerDeck: [baseCard] } });
	const instanceId = state.playerDeck[0]!.id;

	clock.triggerEvent({ type: "addDeckCardState", instanceId, state: dummyStateTest });
	clock.nextTick();
	expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")).not.toBeNull();
	clock.triggerEvent({ type: "removeDeckCardState", instanceId, stateType: dummyStateTest.type });
	clock.nextTick();
	expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")).toBeNull();
});

test("increase/decrease deckCardStateValue", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerDeck: [baseCard] } });
	const instanceId = state.playerDeck[0]!.id;

	clock.triggerEvent({ type: "addDeckCardState", instanceId, state: dummyStateTest });
	clock.nextTick();
	expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value);

	clock.triggerEvent({ type: "increaseDeckCardStateValue", instanceId, stateType: dummyStateTest.type, increaseBy: 2 });
	clock.nextTick();
	expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value! + 2);

	clock.triggerEvent({ type: "decreaseDeckCardStateValue", instanceId, stateType: dummyStateTest.type, decreaseBy: 1 });
	clock.nextTick();
	expect(state.getStateOfDeckCardByInstaceId(instanceId, "dummy")?.value).toBe(dummyStateTest.value! + 1);
});
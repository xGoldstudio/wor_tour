import { expect, test, vi } from "vitest";
import { baseCard, cloneStateTest, drawPlaceCard, dummyStateTest, getInstanceId, initGame, triggerChangeAttackSpeed, triggerDirectAttackResolved, triggerKillCard } from "./common";
import { CardState } from "@repo/lib";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
test("Clone on empty board", () => {
	const { clock, state } = initGame({ gameData: { playerDeck: [{ ...baseCard, states: [{...cloneStateTest, value: 2} as CardState] }] } ,skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(cloneStateTest.value);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.8); // [ ] [ ] [ ] => [ ] [ ] [x]
	triggerKillCard(clock, getInstanceId(state, true, 0));
	clock.nextTick();
	expect(state.getCard(true, 0)).toBeNull();
	expect(state.getCard(true, 2)).not.toBeNull();
	expect(state.getStateOfCard(true, 2, "clone")?.value).toBe(1);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.1); // [ ] [ ] [ ] => [x] [ ] []
	triggerKillCard(clock, getInstanceId(state, true, 2));
	clock.nextTick();
	expect(state.getCard(true, 2)).toBeNull();
	expect(state.getCard(true, 0)).not.toBeNull();
	expect(state.getStateOfCard(true, 0, "clone")).toBe(undefined);
});

test("Clone on full board", () => {
	const { clock, state } = initGame({ gameData: { playerDeck: [{ ...baseCard, states: [{...cloneStateTest, value: 2} as CardState] }] } ,skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	drawPlaceCard(clock, true, 1, state);
	drawPlaceCard(clock, true, 2, state);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(cloneStateTest.value);

	triggerKillCard(clock, getInstanceId(state, true, 0));
	clock.nextTick();
	expect(state.getCard(true, 0)).not.toBeNull();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(1);

	triggerKillCard(clock, getInstanceId(state, true, 0));
	clock.nextTick();
	expect(state.getCard(true, 0)).not.toBeNull();
	expect(state.getStateOfCard(true, 0, "clone")).toBe(undefined);
	
	// now testing on 2 empty zones
	vi.spyOn(global.Math, 'random').mockReturnValue(0.8); // [d] [d] [x] => [ ] [x] [x]
	triggerKillCard(clock, getInstanceId(state, true, 0));
	triggerKillCard(clock, getInstanceId(state, true, 1));
	clock.nextTick();
	expect(state.getCard(true, 0)).toBeNull();
	expect(state.getCard(true, 1)).not.toBeNull();
	expect(state.getStateOfCard(true, 1, "clone")?.value).toBe(1);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.1); // [ ] [d] [x] => [x] [ ] [x]
	triggerKillCard(clock, getInstanceId(state, true, 1));
	clock.nextTick();
	expect(state.getCard(true, 1)).toBeNull();
	expect(state.getCard(true, 0)).not.toBeNull();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBeUndefined();
});

// also test purging states
test("Clone should remove all states expect clone, and rese stats to initial", () => {
	const { clock, state } = initGame({ gameData: { playerDeck: [{ ...baseCard, states: [{...cloneStateTest, value: 2} as CardState, dummyStateTest] }] } ,skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(cloneStateTest.value);
	expect(state.getStateOfCard(true, 0, "dummy")).toBeDefined();

	const instanceId = getInstanceId(state, true, 0);
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10);
	triggerChangeAttackSpeed(clock, instanceId, 60);
	clock.nextTick();

	expect(state.getCard(true, 0)!.hp).not.toBe(baseCard.hp);
	expect(state.getCard(true, 0)!.attackSpeed).not.toBe(baseCard.attackSpeed);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.1); // [d] [ ] [ ] => [x] [ ] [ ]
	triggerKillCard(clock, getInstanceId(state, true, 0));
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(1);
	expect(state.getStateOfCard(true, 0, "dummy")).toBeUndefined();
	expect(state.getCard(true, 0)!.hp).toBe(baseCard.hp);
	expect(state.getCard(true, 0)!.attackSpeed).toBe(baseCard.attackSpeed);
});

test("Clone should not target alive cards", () => {
	const { clock, state } = initGame({ gameData: { playerDeck: [{ ...baseCard, states: [{...cloneStateTest, value: 2} as CardState, dummyStateTest] }] } ,skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	drawPlaceCard(clock, true, 1, state);
	drawPlaceCard(clock, true, 2, state);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "clone")?.value).toBe(cloneStateTest.value);
	expect(state.getStateOfCard(true, 0, "dummy")).toBeDefined();

	const instanceId = getInstanceId(state, true, 1);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.9);
	triggerKillCard(clock, instanceId);
	clock.nextTick();

	expect(state.getStateOfCard(true, 1, "clone")?.value).toBe(1);
	expect(state.getCard(true, 0)).toBeDefined();
	expect(state.getCard(true, 2)).toBeDefined();
});
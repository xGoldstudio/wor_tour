import { CardState } from '@repo/lib';
import { baseCard, drawPlaceCard, initGame } from './common';
import { describe, expect, test } from 'vitest';

const dummyStateTest: CardState = { type: "dummyMaxStacking", value: 1, trigger: "idle", target: "selfCard" };

describe("State stack strategy max", () => {
	const card = baseCard;
	card.states = [{ ...dummyStateTest }];
	const { state, clock } = initGame({ gameData: { playerDeck: [card] }, skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "dummyMaxStacking")?.value).toBe(1);

	test("Add same value (should not change the state amount)", () => {
		clock.triggerEvent({ type: "addState", instanceId: state.getCard(true, 0)!.instanceId, state: { ...dummyStateTest } });
		clock.nextTick();
		expect(clock.getLastTickEvents().find(e => e.type === "increaseStateValue")).toBeUndefined();
		expect(state.getStateOfCard(true, 0, "dummyMaxStacking")?.value).toBe(1);
	});

	test("Add higher value (should change the state amount)", () => {
		clock.triggerEvent({ type: "addState", instanceId: state.getCard(true, 0)!.instanceId, state: { ...dummyStateTest, value: 10 } });
		clock.nextTick();
		expect(clock.getLastTickEvents().find(e => e.type === "increaseStateValue")).toBeDefined();
		expect(state.getStateOfCard(true, 0, "dummyMaxStacking")?.value).toBe(10);
	});

	test("Add lwoer value (should not the state amount)", () => {
		clock.triggerEvent({ type: "addState", instanceId: state.getCard(true, 0)!.instanceId, state: { ...dummyStateTest, value: 5 } });
		clock.nextTick();
		expect(clock.getLastTickEvents().find(e => e.type === "increaseStateValue")).toBeUndefined();
		expect(state.getStateOfCard(true, 0, "dummyMaxStacking")?.value).toBe(10);
	});
});

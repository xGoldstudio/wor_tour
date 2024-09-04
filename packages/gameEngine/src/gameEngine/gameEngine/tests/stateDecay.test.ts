import { CardState } from '@repo/lib';
import { baseCard, drawPlaceCard, initGame } from './common';
import { expect, test } from 'vitest';

const dummyStateTest: CardState = { type: "dummyWithDecay", value: 2, trigger: "idle", target: "selfCard" };

test("Normal decay", () => {
	const card = baseCard;
	card.states = [{ ...dummyStateTest }];
	const { state, clock } = initGame({ gameData: { playerDeck: [card] }, skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(clock.getLastTickEvents().find(e => e.type === "startStateDecay")).toBeDefined();
	expect(clock)
	clock.nextTick();
	clock.nextTick();
	expect(clock.getLastTickEvents().find(e => e.type === "endStateDecay")).toBeDefined();
	expect(state.getCard(true, 0)!.states.find(s => s.type === "dummyWithDecay")).toBeUndefined();
});

test("Decay but state added again before end of the decay", () => {
	const card = baseCard;
	card.states = [{ ...dummyStateTest }];
	const { clock, state } = initGame({ gameData: { playerDeck: [card] }, skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(clock.getLastTickEvents().find(e => e.type === "startStateDecay")).toBeDefined();
	expect(clock)
	clock.triggerEvent({ type: "addState", instanceId: state.getCard(true, 0)!.instanceId, state: { ...dummyStateTest } });
	clock.nextTick();
	for (let i = 0; i < 10; i++) {
		clock.triggerEvent({ type: "addState", instanceId: state.getCard(true, 0)!.instanceId, state: { ...dummyStateTest } });
		expect(state.getCard(true, 0)!.states.find(s => s.type === "dummyWithDecay")).toBeDefined();
		expect(clock.getLastTickEvents().find(e => e.type === "startStateDecay")).toBeDefined();
		clock.nextTick();
	}
	clock.nextTick();
	clock.nextTick();
	expect(clock.getLastTickEvents().find(e => e.type === "endStateDecay")).toBeDefined();
	expect(state.getCard(true, 0)!.states.find(s => s.type === "dummyWithDecay")).toBeUndefined();
});
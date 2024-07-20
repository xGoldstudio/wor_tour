import Clock from "../../clock/clock";
import { EventType } from "../../../types/eventType";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject, defaultManaSpeed } from "../gameState";
import { expect, test } from 'vitest';

test("base state", () => {
	const state = new GameStateObject({ playerDeck: [], opponentDeck: [], playerHp: 0, opponentHp: 0});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.playerMana).toBe(0);
	expect(state.opponentMana).toBe(0);
  expect(clock.getImmutableInternalState().currentFrame).toBe(0);
	expect(state.playerTickStartEarningMana).toBe(null);
	expect(state.opponentTickStartEarningMana).toBe(null);
});

test("earning mana", () => {
	const state = new GameStateObject({ playerDeck: [], opponentDeck: [], playerHp: 0, opponentHp: 0});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.playerMana).toBe(0);
	expect(state.opponentMana).toBe(0);
  expect(clock.getImmutableInternalState().currentFrame).toBe(0);
	expect(state.playerTickStartEarningMana).toBe(null);
	expect(state.opponentTickStartEarningMana).toBe(null);

	clock.triggerEvent({ type: "startEarningMana", isPlayer: true }); // will be call on the next tick
	clock.triggerEvent({ type: "startEarningMana", isPlayer: false }); // will be call on the next tick
	clock.nextTick();
	expect(clock.getImmutableInternalState().currentFrame).toBe(1);
	expect(state.playerTickStartEarningMana).toBe(0); // has been run on frame 0
	expect(state.opponentTickStartEarningMana).toBe(0); // has been run on frame 0
	clock.nextTick();
	clock.nextTick();
	expect(state.playerMana).toBe(0);
	expect(state.opponentMana).toBe(0);
	for (let i = 0; i < defaultManaSpeed - 3; i++) {
		clock.nextTick();
	}
	expect(state.playerMana).toBe(0);
	expect(state.opponentMana).toBe(0);
	expect(state.playerTickStartEarningMana).toBe(0);
	expect(state.opponentTickStartEarningMana).toBe(0);
	clock.nextTick();
	expect(state.playerMana).toBe(1);
	expect(state.opponentMana).toBe(1);
	expect(state.playerTickStartEarningMana).toBe(defaultManaSpeed);
	expect(state.opponentTickStartEarningMana).toBe(defaultManaSpeed);

	// caped to 9
	for (let i = 0; i < defaultManaSpeed*20; i++) {
		clock.nextTick();
	}
	expect(state.playerMana).toBe(9);
	expect(state.opponentMana).toBe(9);
	expect(state.playerTickStartEarningMana).toBe(null);
	expect(state.opponentTickStartEarningMana).toBe(null);

	clock.triggerEvent({ type: "manaConsume", isPlayer: true, delta: 5 }); // will be call on the next tick
	clock.triggerEvent({ type: "manaConsume", isPlayer: false, delta: 5 }); // will be call on the next tick

	clock.nextTick();

	expect(state.playerMana).toBe(4);
	expect(state.opponentMana).toBe(4);

	const currentTick = clock.getImmutableInternalState().currentFrame;
	
	expect(state.playerTickStartEarningMana).toBe(currentTick - 1);
	expect(state.opponentTickStartEarningMana).toBe(currentTick - 1);
});

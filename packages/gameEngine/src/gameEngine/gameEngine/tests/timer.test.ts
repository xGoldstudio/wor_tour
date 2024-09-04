import { EventType } from "../../../types/eventType";
import { ClockReturn } from "../../clock/clock";
import { TIMER_INCREASE_DELAY } from "../events/timerDecrease";
import { MAX_GAME_DURATION } from "../gameState";
import { initGame, triggerDamageToPlayer } from "./common";
import { expect, test } from 'vitest';

function goToNextTimer(clock: ClockReturn<EventType>) {
	for (let i = 0; i < TIMER_INCREASE_DELAY; i++) {
		clock.nextTick();
	}
}

test("normal ending, opponent win", () => {
	const { clock, state } = initGame({ skipStartGame: true });
	expect(state.getTimer()).toBe(MAX_GAME_DURATION);
	clock.nextTick();
	goToNextTimer(clock);
	expect(state.getTimer()).toBe(MAX_GAME_DURATION - 1);
	clock.nextTick();
	expect(state.getTimer()).toBe(MAX_GAME_DURATION - 1);

	for (let i = 0; i < TIMER_INCREASE_DELAY - 1; i++) {
		clock.nextTick();
	}
	expect(state.getTimer()).toBe(MAX_GAME_DURATION - 2);
	for (let i = 0; i < MAX_GAME_DURATION - 3; i++) {
		goToNextTimer(clock);
	}
	expect(state.getTimer()).toBe(1);
	goToNextTimer(clock);
	expect(state.getTimer()).toBe(0);
	expect(state.currentWinner).toBe("draw");
	goToNextTimer(clock);
	expect(state.getTimer()).toBe(0);
});

test("nobody lost hp", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerHp: 2, opponentHp: 1 } });
	clock.nextTick();
	for (let i = 0; i < MAX_GAME_DURATION; i++) {
		goToNextTimer(clock);
	}
	expect(state.currentWinner).toBe("draw");
});

test("player have more init hp but lost some", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerHp: 10, opponentHp: 5 } });
	triggerDamageToPlayer(clock, true, 1);
	clock.nextTick();
	for (let i = 0; i < MAX_GAME_DURATION; i++) {
		goToNextTimer(clock);
	}
	expect(state.currentWinner).toBe("opponent");
});

test("player have lost hp, opponent more", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerHp: 10, opponentHp: 5 } });
	triggerDamageToPlayer(clock, true, 1);
	triggerDamageToPlayer(clock, false, 2);
	clock.nextTick();
	for (let i = 0; i < MAX_GAME_DURATION; i++) {
		goToNextTimer(clock);
	}
	expect(state.currentWinner).toBe("player");
});


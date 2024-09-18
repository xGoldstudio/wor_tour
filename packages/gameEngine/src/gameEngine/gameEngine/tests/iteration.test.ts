import { expect, test } from "vitest";
import { baseCard, drawPlaceCard, initGame, triggerNormalPlaceCard } from "./common";
import { MAX_ATTACK_SPEED } from "../gameState";
import { ITERATION_STRENGTH_MULTIPLIER } from "../../states/stateActions/iteration";

test("Iteration", () => {
	const { clock, state } = initGame({
		skipStartGame: true,
		gameData: { playerDeck: [{ ...baseCard, states: [{ type: "iteration", value: 0, trigger: "onPlacement", target: "selfCard"  }] }] },
	});
	const instanceId = state.getDeck(true)[0].id;
	expect(state.getStateOfDeckCard(instanceId, "iteration")?.value).toBe(0);
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getStateOfDeckCard(instanceId, "iteration")?.value).toBe(1);
	triggerNormalPlaceCard(clock, true, 0, instanceId);
	clock.nextTick();
	expect(state.getStateOfDeckCard(instanceId, "iteration")?.value).toBe(2);
	triggerNormalPlaceCard(clock, true, 0, instanceId);
	clock.nextTick();
	expect(state.getCard(true, 0)?.maxHp).toBe(Math.floor(baseCard.hp * ITERATION_STRENGTH_MULTIPLIER ** 2));
	expect(state.getCard(true, 0)?.initialAttackSpeed).toBe(baseCard.attackSpeed * ITERATION_STRENGTH_MULTIPLIER ** 2);
	expect(state.getCard(true, 0)?.dmg).toBe(Math.floor(baseCard.dmg * ITERATION_STRENGTH_MULTIPLIER ** 2));
});

test("Limits", () => {
	const { clock, state } = initGame({
		skipStartGame: true,
		gameData: { playerDeck: [{ ...baseCard, hp: 16, attackSpeed: 2.5, dmg: 13, states: [{ type: "iteration", value: 10, trigger: "onPlacement", target: "selfCard"  }] }] },
	});
	const instanceId = state.getDeck(true)[0].id;
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getStateOfDeckCard(instanceId, "iteration")?.value).toBe(11);
	expect(state.getCard(true, 0)?.initialAttackSpeed).toBe(MAX_ATTACK_SPEED);
	// test that it is not a float
	expect(Number.isInteger(state.getCard(true, 0)?.dmg)).toBeTruthy();
	expect(Number.isInteger(state.getCard(true, 0)?.hp)).toBeTruthy();
})
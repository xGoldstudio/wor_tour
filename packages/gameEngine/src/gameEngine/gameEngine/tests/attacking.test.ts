import { DAMAGE_SPEED } from "../events/cardDamage";
import { getFrameFromAttackSpeed } from "../events/utils";
import { drawPlaceCard, initGame } from "./common";
import { expect, test } from 'vitest';

test("attacking pipeline", () => {
	const { state, clock } = initGame({ skipStartGame: true });
	void state;
	void clock;
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.playerBoard[0]?.startAttackingTick).toBe(0);

	const attackFrames = getFrameFromAttackSpeed(state.playerBoard[0]!.attackSpeed);
	for (let i = 0; i < attackFrames - 1; i++) {
		clock.nextTick();
	}
	expect(state.playerBoard[0]?.startAttackingTick).toBe(0);
	expect(state.opponentHp).toBe(200); // should not have taken damage yet
	clock.nextTick();
	expect(state.playerBoard[0]?.startAttackingTick).toBe(attackFrames);
	expect(state.opponentHp).toBe(200); // no damage yet
	for (let i = 0; i < DAMAGE_SPEED - 1; i++) {
		clock.nextTick();
	}
	expect(state.opponentHp).toBe(200); // no damage yet
	clock.nextTick();
	expect(state.opponentHp).toBe(100); // damage applied

	drawPlaceCard(clock, false, 0, state);

	clock.nextTick();
	for (let i = 0; i < attackFrames + DAMAGE_SPEED; i++) {
		clock.nextTick();
	}
	expect(state.opponentBoard[0]?.hp).toBe(100); // defend the attack
	expect(state.opponentHp).toBe(100); // so no more damage taken for now
});

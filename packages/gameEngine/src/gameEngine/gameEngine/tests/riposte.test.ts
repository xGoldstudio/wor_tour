import { attackAnimation, baseCard, defaultTestDamage, defaultTestHp, drawPlaceCard, initTest, triggerDirectAttackResolved } from "./common";
import * as _ from "lodash";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";

const usingDeck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

usingDeck[0].states.push({
	type: "riposte",
	value: 2,
	trigger: "onDirectlyAttacked",
	target: "directEnnemyCard",
});

test("start damage to card (animation placeholder)", () => {
	const { clock, state } = initTest({ playerDeck: usingDeck});
	drawPlaceCard(clock, true, 0);
	drawPlaceCard(clock, false, 0);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "riposte")).toBeDefined();

	const damage = 50;

	triggerDirectAttackResolved(clock, state, false, 0, damage, true); // not direct attack
	clock.nextTick();

	// should not trigger direct attack
	expect(state.getStateOfCard(true, 0, "riposte")?.value).toBe(2);

	triggerDirectAttackResolved(clock, state, false, 0, damage);
	clock.nextTick();

	expect(state.getStateOfCard(true, 0, "riposte")?.value).toBe(1);

	attackAnimation(clock);

	expect(state.getCard(false, 0)?.hp).toBe(defaultTestHp - defaultTestDamage); // riposte attack ended

	triggerDirectAttackResolved(clock, state, false, 0, damage);
	clock.nextTick();

	expect(state.getStateOfCard(true, 0, "riposte")).toBeUndefined();

	attackAnimation(clock);

	expect(state.getCard(false, 0)).toBeNull();
});

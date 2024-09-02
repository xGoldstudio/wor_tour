import { baseCard, CardState, divineShieldTest, initTest, triggerDirectAttackResolved, triggerPlaceCard } from 'game_engine';
import { expect, test } from 'vitest';
import { placeCardFromCardType } from '../events/normalPlaceCard';

test("Divine shield, not stacked", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [divineShieldTest] }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeDefined();
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10, true); // not direct attack, should receive the damage normally
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 10);
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack, blocked by the shield
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 10);
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeUndefined();
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack, not blocked anymore
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 20);
});

test("Divine shield, stacked", () => {
	const amount = 3;
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [{ ...divineShieldTest, value: amount } as CardState] }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeDefined();
	
	for (let i = 0; i < amount; i++) {
		triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack
		clock.nextTick();
		expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp);
		if (i !== amount - 1) {
			expect(state.getStateOfCard(true, 0, "divineShield")?.value).toBe(amount - i - 1);
		}
	}
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack, no more shield
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 10);
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeUndefined();
});

test("Case two attacks in the same frame", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [divineShieldTest] }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeDefined();
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 10);
	expect(state.getStateOfCard(true, 0, "divineShield")).toBeUndefined();
});
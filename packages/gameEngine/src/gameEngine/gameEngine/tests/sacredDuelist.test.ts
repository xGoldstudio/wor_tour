import { baseCard, initGame, sacredDuelistTest, triggerDirectAttackResolved, triggerPlaceCard } from 'game_engine';
import { expect, test } from 'vitest';
import { placeCardFromCardType } from '../events/normalPlaceCard';

test("self card, attack longer than 45", () => {
	const { clock, state } = initGame({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [sacredDuelistTest] }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "sacredDuelist")).toBeDefined();
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10, true); // not direct attack
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp);
	triggerDirectAttackResolved(clock, state, instanceId, instanceId, 10); // direct attack
	clock.nextTick();
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - 10);
});

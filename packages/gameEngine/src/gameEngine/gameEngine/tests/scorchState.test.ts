import { baseCard, initTest, scorchTest, triggerAddState, triggerPlaceCard } from 'game_engine';
import { expect, test } from 'vitest';
import { placeCardFromCardType } from '../events/normalPlaceCard';

test("Scorch stacking", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [scorchTest] }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "scorch")?.value).toBe(10);
	triggerAddState(clock, instanceId, scorchTest);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * 1));
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "scorch")?.value).toBe(20);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * (1+2)));

	triggerAddState(clock, instanceId, scorchTest);
	triggerAddState(clock, instanceId, scorchTest);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "scorch")?.value).toBe(40);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * (1+2+3+4)));
});

test("Scorch stacking, not already exisiting", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard }));
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	triggerAddState(clock, instanceId, scorchTest);
	clock.nextTick();
	triggerAddState(clock, instanceId, scorchTest);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * 1));
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "scorch")?.value).toBe(20);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * (1+2)));

	triggerAddState(clock, instanceId, scorchTest);
	triggerAddState(clock, instanceId, scorchTest);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "scorch")?.value).toBe(40);
	expect(state.getCardByInstance(instanceId)?.hp).toBe(baseCard.hp - (scorchTest.value! * (1+2+3+4)));
});

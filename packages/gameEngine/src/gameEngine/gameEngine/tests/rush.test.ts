import { baseCard, drawPlaceCard, initTest, rushStateTest, triggerPlaceCard } from 'game_engine';
import { expect, test } from 'vitest';
import { CARD_ATTACK_ANIMATION_DURATION } from '../events/cardStartAttacking';
import { getFrameFromAttackSpeed } from '../events/utils';
import { placeCardFromCardType } from '../events/normalPlaceCard';

test("self card, attack longer than 45", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [ { ...baseCard, states: [rushStateTest] } ] } });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "rush")).toBeUndefined();
	expect(state.getCardByInstance(instanceId)?.endAttackingTick).toBe(clock.getImmutableInternalState().currentFrame + CARD_ATTACK_ANIMATION_DURATION - 1);
});

test("self card, attack shorter than 45 (shouldn't change anything)", () => {
	const AS = 3;
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [ { ...baseCard, attackSpeed: AS, states: [rushStateTest] } ] } });
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	const instanceId = state.getCard(true, 0)!.instanceId;
	expect(state.getStateOfCard(true, 0, "rush")).toBeUndefined();
	expect(state.getCardByInstance(instanceId)?.endAttackingTick).toBe(getFrameFromAttackSpeed(AS));
});

test("allies card and self, normal behavior", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, true, 1, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, true, 2, placeCardFromCardType({ ...baseCard, states: [rushStateTest] }));
	clock.nextTick();
	expect(state.getStateOfCard(true, 2, "rush")).toBeUndefined();
	const targetFrameEndAttack = clock.getImmutableInternalState().currentFrame + CARD_ATTACK_ANIMATION_DURATION - 1;
	expect(state.getCard(true, 0)?.endAttackingTick).toBe(targetFrameEndAttack);
	expect(state.getCard(true, 1)?.endAttackingTick).toBe(targetFrameEndAttack);
	expect(state.getCard(true, 2)?.endAttackingTick).toBe(targetFrameEndAttack);
});

test("ally card already attacking (shouldn't reset the attack)", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, true, 1, placeCardFromCardType(baseCard));
	clock.nextTick();
	const frames = getFrameFromAttackSpeed(baseCard.attackSpeed);
	for (let i = 0; i < (frames - 5); i++) {
		clock.nextTick();
	}
	expect(state.getCard(true, 0)?.endAttackingTick).toBe(frames);
	triggerPlaceCard(clock, true, 2, placeCardFromCardType({ ...baseCard, states: [rushStateTest] }));
	clock.nextTick();
	const targetFrameEndAttack = clock.getImmutableInternalState().currentFrame + CARD_ATTACK_ANIMATION_DURATION - 1;
	expect(state.getCard(true, 0)?.endAttackingTick).toBe(frames);
	expect(state.getCard(true, 1)?.endAttackingTick).toBe(frames);
	expect(state.getCard(true, 2)?.endAttackingTick).toBe(targetFrameEndAttack);
});
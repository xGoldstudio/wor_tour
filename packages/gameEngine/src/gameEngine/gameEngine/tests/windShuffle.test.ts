import { baseCard } from './common';
import { initGame, triggerPlaceCard, windShuffleTest } from 'game_engine';
import { expect, test, vi } from 'vitest';
import { placeCardFromCardType } from '../events/normalPlaceCard';
import { CardType } from '@repo/lib';

function checkHand(hand: (CardType | null)[], ids: number[]) {
	expect(hand.filter(c => c).map(c => c?.id)).toEqual(ids);
}

test("Divine shield, not stacked", () => {
	const { clock, state } = initGame({ skipStartGame: true, gameData: { playerDeck: [baseCard, { ...baseCard, id: 2 }, { ...baseCard, id: 3 }, { ...baseCard, id: 4 }, { ...baseCard, id: 5 }] } });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [windShuffleTest] }));
	vi.spyOn(global.Math, 'random').mockReturnValue(0.8);
	clock.nextTick();
	expect(state.playerHand.filter(c => c).length).toBe(4); // card has been shuffled
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [windShuffleTest] }));
	checkHand(state.playerHand, [1,2,3,4]);
	clock.nextTick();
	expect(state.playerHand.filter(c => c).length).toBe(4); // card has been shuffled
	checkHand(state.playerHand, [5,1,2,3]);
});
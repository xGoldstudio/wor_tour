import { filterNulls, safeArray } from '@repo/lib';
import { GameStateObject, InGameCardType } from 'game_engine';

export default function onEnnemyCardsTarget({ gameState, instanceId, }: { gameState: GameStateObject, instanceId: number }) {
	return (callbackFn: (card: InGameCardType) => void) => filterNulls(safeArray(gameState.getBoardOfCard(instanceId, true))).forEach(callbackFn);
}
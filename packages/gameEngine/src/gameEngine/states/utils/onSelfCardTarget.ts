import { GameStateObject, InGameCardType } from 'game_engine';

export default function onSelfCardTarget({ gameState, instanceId, }: { gameState: GameStateObject, instanceId: number }) {
	return (callbackFn: (args: {
		card: InGameCardType,
		position: number,
		isPlayerCard: boolean,
	}) => void) => {
		const infos = gameState.getCardInfo(instanceId);
		if (infos === null) return;
		callbackFn(infos);
	};
}
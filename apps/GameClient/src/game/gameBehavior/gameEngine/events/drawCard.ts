import { ComputeEventProps } from '../gameEngine';
import { DrawCardEvent } from './../../useGameEvents';

export default function drawCardEvent({ event, gameState }: ComputeEventProps<DrawCardEvent>) {
	// if a card exist at the position we replace it
	if (gameState.getHandFromState(event.isPlayer)[event.handPosition] !== null) {
		gameState.cardHandToDeck(event.isPlayer, event.handPosition);
	}
	gameState.cardDeckToHand(event.isPlayer, event.handPosition);
}
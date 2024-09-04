import { ComputeEventProps } from '../gameEngine';
import { DrawCardEvent } from "../../../types/eventType";

export default function drawCardEvent({ event, gameState }: ComputeEventProps<DrawCardEvent>) {
	// if a card exist at the position we replace it
	if (gameState.getHandFromState(event.isPlayer)[event.position] !== null) {
		gameState.cardHandToDeck(event.isPlayer, event.position);
	}
	gameState.cardDeckToHand(event.isPlayer, event.position);
}
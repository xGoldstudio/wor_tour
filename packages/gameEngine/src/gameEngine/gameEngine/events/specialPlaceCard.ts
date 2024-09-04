import { NormalPlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<NormalPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = event.isPlayer
	? gameState.playerHand[event.position]
	: gameState.opponentHand[event.position];
	if (card === null) {
		throw new Error("Card not found in hand");
	}
	clock.triggerEvent({
		type: "manaConsume",
		isPlayer: event.isPlayer,
		delta: card.cost,
	});
	clock.triggerEvent({
		type: "drawCard",
		isPlayer: event.isPlayer,
		position: event.position,
	});
}
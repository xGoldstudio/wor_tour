import { NormalPlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function normalPlaceCardEvent({ event, gameState, clock }: ComputeEventProps<NormalPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = event.isPlayer
	? gameState.playerHand[event.cardInHandPosition]
	: gameState.opponentHand[event.cardInHandPosition];
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
		handPosition: event.cardInHandPosition,
	});
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayer,
		position: event.position,
		card,
		isSpecialPlacement: false,
	})
}
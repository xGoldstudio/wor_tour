import { PlayerPlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

// this event is a securtiy to avoid placing a card that is not in the hand or not enough mana
export default function playerPlaceCardEvent({ event, gameState, clock }: ComputeEventProps<PlayerPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = gameState.getDeckCardByInstanceId(event.instanceId);
	if (!card) {
		console.warn("Card not found in hand");
		return;
	}
	const positionOfCardInHand = gameState.getPositionInHand(event.instanceId, event.isPlayer);
	if (positionOfCardInHand === -1) {
		console.warn("Card already placed");
		return;
	}
	if (card.cost > gameState.getMana(event.isPlayer)) {
		console.warn("Not enough mana");
		return;
	}
	clock.triggerEvent({
		type: "normalPlaceCard",
		isPlayer: event.isPlayer,
		position: event.position,
		instanceId: event.instanceId,
	});
}
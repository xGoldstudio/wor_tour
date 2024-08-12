import { PlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<PlaceCardEvent>) {
	const existingCard = gameState.getCard(event.isPlayer, event.position);
	if (existingCard) {
		clock.triggerEvent({
			type: "beforeCardDestroyed",
			instanceId: existingCard.instanceId,
		})
	}
	clock.triggerEvent({
		type: "afterPlaceCard",
		card: event.card,
		isPlayer: event.isPlayer,
		position: event.position,
		isSpecialPlacement: event.isSpecialPlacement
	});
}
import { InGameCardType, PlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<PlaceCardEvent>) {
	const cardInGame: InGameCardType = {
		...event.card,
		instanceId: gameState.getNextInstanceId(),
	}
	gameState.placeCardBoard(event.isPlayer, event.position, cardInGame);
	triggerStates({
		trigger: "onPlacement",
		clock,
		gameState,
		isPlayerCard: event.isPlayer,
		cardPosition: event.position,
		initiator: event,
	});
	clock.triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.position,
		instanceId: cardInGame.instanceId,
	});
}
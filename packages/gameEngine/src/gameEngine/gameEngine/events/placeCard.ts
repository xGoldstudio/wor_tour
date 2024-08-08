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
		instanceId: cardInGame.instanceId,
		initiator: event,
	});
	clock.triggerEvent({
		type: "cardStartAttacking",
		instanceId: cardInGame.instanceId,
	});
}
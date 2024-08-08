import { CardDestroyedEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function cardDestroyedEvent({ gameState, event, clock }: ComputeEventProps<CardDestroyedEvent>) {
	triggerStates({
		gameState,
		trigger: "onDeath",
		clock,
		isPlayerCard: event.initiator.isPlayerCard,
		cardPosition: event.initiator.cardPosition,
		initiator: event,
	})
	gameState.destroyCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
}
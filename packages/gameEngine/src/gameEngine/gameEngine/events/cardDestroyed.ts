import { CardDestroyedEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function cardDestroyedEvent({ gameState, event, clock }: ComputeEventProps<CardDestroyedEvent>) {
	triggerStates({
		gameState,
		trigger: "onDeath",
		clock,
		initiator: event,
		instanceId: event.initiator.instanceId,
	});
	gameState.destroyCard(event.initiator.instanceId);
}
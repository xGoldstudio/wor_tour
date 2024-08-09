import { CardDestroyedEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

// proxy event to trigger onDeath states
export default function beforeCardDestroyed({ gameState, event, clock }: ComputeEventProps<CardDestroyedEvent>) {
	triggerStates({
		gameState,
		trigger: "onDeath",
		clock,
		initiator: event,
		instanceId: event.initiator.instanceId,
	});
	clock.triggerEvent({
		type: "cardDestroyed",
		initiator: event.initiator,
	});
}
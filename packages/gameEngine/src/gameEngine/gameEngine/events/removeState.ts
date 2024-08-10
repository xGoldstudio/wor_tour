import { RemoveStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function removeStateEvent({ gameState, event, clock }: ComputeEventProps<RemoveStateEvent>) {
	gameState.removeState(event.instanceId, event.stateType);
	clock.triggerEvent({
		type: "stateLifecycleOnRemove",
		instanceId: event.instanceId,
		stateType: event.stateType,
	});
}
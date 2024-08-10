import { DecreaseStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function decreaseStateValueEvent({ gameState, event, clock }: ComputeEventProps<DecreaseStateValueEvent>) {
	gameState.modifyStateValue(event.instanceId, event.stateType, -event.decreaseBy);
	clock.triggerEvent({
		type: "stateLifecycleOnChangeValue",
		instanceId: event.instanceId,
		stateType: event.stateType,
		delta: -event.decreaseBy,
	});
}
import { IncreaseStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function increaseStateValueEvent({ gameState, event, clock }: ComputeEventProps<IncreaseStateValueEvent>) {
	gameState.modifyStateValue(event.instanceId, event.stateType, event.increaseBy);
	clock.triggerEvent({
		type: "stateLifecycleOnChangeValue",
		instanceId: event.instanceId,
		stateType: event.stateType,
		delta: event.increaseBy,
	});
}
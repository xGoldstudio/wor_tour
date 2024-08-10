import { EndStateDecayEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function endStateDecay({ gameState, clock, event }: ComputeEventProps<EndStateDecayEvent>) {
	gameState.removeStateDecayTimeout(event.instanceId, event.stateType);
	clock.triggerEvent({
		type: "beforeRemoveState",
		instanceId: event.instanceId,
		stateType: event.stateType,
	});
}
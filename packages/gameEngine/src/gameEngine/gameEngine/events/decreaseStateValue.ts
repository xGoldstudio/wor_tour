import { DecreaseStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function decreaseStateValueEvent({ gameState, event }: ComputeEventProps<DecreaseStateValueEvent>) {
	gameState.modifyStateValue(event.instanceId, event.stateType, -event.decreaseBy);
}
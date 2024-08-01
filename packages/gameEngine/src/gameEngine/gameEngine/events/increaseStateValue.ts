import { IncreaseStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function increaseStateValueEvent({ gameState, event }: ComputeEventProps<IncreaseStateValueEvent>) {
	gameState.modifyStateValue(event.instanceId, event.stateType, event.increaseBy);
}
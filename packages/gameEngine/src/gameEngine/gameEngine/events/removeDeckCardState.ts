import { RemoveDeckCardStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function removeDeckCardState({ gameState, event }: ComputeEventProps<RemoveDeckCardStateEvent>) {
	gameState.removeDeckCardState(event.instanceId, event.stateType);
}
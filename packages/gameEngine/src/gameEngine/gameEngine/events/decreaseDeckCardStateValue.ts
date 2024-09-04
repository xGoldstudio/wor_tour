import { DecreaseDeckCardStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function decreaseDeckCardStateValueEvent({ gameState, event }: ComputeEventProps<DecreaseDeckCardStateValueEvent>) {
	gameState.modifyDeckCardStateValue(event.instanceId, event.stateType, -event.decreaseBy);
}
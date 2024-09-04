import { IncreaseDeckCardStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function increaseDeckCardStateValueEvent({ gameState, event }: ComputeEventProps<IncreaseDeckCardStateValueEvent>) {
	gameState.modifyDeckCardStateValue(event.instanceId, event.stateType, event.increaseBy);
}
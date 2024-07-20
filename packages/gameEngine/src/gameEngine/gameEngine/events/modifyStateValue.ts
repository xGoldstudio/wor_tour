import { ModifyStateValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function modifyStateValueEvent({ gameState, event }: ComputeEventProps<ModifyStateValueEvent>) {
	gameState.modifyStateValue(event.isPlayerCard, event.cardPosition, event.state, event.value);
}
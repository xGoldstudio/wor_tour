import { RemoveStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function removeStateEvent({ gameState, event }: ComputeEventProps<RemoveStateEvent>) {
	gameState.removeState(event.isPlayerCard, event.cardPosition, event.state);
}
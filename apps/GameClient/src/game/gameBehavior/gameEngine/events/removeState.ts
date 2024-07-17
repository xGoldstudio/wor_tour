import { RemoveStateEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function removeStateEvent({ gameState, event }: ComputeEventProps<RemoveStateEvent>) {
	gameState.removeState(event.isPlayerCard, event.cardPosition, event.state);
}
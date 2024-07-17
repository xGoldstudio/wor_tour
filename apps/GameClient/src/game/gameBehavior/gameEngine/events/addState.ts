import { AddStateEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function addStateEvent({ gameState, event }: ComputeEventProps<AddStateEvent>) {
	gameState.addState(event.isPlayerCard, event.cardPosition, event.state);
}
import { CardDestroyedEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function cardDestroyedEvent({ gameState, event }: ComputeEventProps<CardDestroyedEvent>) {
	gameState.destroyCard(event.initiator.isPlayerCard, event.initiator.cardPosition);
}
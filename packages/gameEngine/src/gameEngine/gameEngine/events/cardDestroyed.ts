import { CardDestroyedEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function cardDestroyedEvent({ gameState, event }: ComputeEventProps<CardDestroyedEvent>) {
	gameState.destroyCard(event.initiator.instanceId);
}
import { HealCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function healCardEvent({ gameState, event }: ComputeEventProps<HealCardEvent>) {
	gameState.healCard(event.instanceId, event.amount);
}
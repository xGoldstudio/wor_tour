import { CardEndAttackingAnimationEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function cardEndAttackingAnimation({ gameState, event }: ComputeEventProps<CardEndAttackingAnimationEvent>) {
	gameState.endAttackAnimation(event.instanceId);
}
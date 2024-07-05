import { RemoveEffectEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function removeEffectEvent({ gameState, event }: ComputeEventProps<RemoveEffectEvent>) {
	gameState.removeEffect(
		event.isPlayerCard,
		event.cardPosition,
		event.effectToRemove
	);
}
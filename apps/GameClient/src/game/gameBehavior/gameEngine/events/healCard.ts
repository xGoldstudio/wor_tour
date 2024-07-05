import { HealCardEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function healCardEvent({ gameState, event }: ComputeEventProps<HealCardEvent>) {
	gameState.healCard(event.isPlayerCard, event.cardPosition, event.amount);
}
import { GameOverEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function gameOverEvent({ gameState, event }: ComputeEventProps<GameOverEvent>) {
	gameState.setGameOver(event.winner);
}
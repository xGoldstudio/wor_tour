import { GameOverEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function gameOverEvent({ gameState, event }: ComputeEventProps<GameOverEvent>) {
	gameState.setGameOver(event.winnerIsPlayer);
}
import { StartGameEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function startGame({ gameState }: ComputeEventProps<StartGameEvent>) {
	gameState.startGame();
}
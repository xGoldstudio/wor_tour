import { StartGame } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function startGame({ gameState }: ComputeEventProps<StartGame>) {
	gameState.startGame();
}
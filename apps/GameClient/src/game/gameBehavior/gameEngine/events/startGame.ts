import { StartGame } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function startGame({ gameState }: ComputeEventProps<StartGame>) {
	gameState.startGame();
}
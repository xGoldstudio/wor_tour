import { StartGameEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { TIMER_INCREASE_DELAY } from "./timerDecrease";

export default function startGame({ gameState, clock }: ComputeEventProps<StartGameEvent>) {
	gameState.startGame();
	clock.setGameEventTimeout({ type: "timerDecrease" }, TIMER_INCREASE_DELAY);
}
import { TimerDecreaseEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export const TIMER_INCREASE_DELAY = 100; // frame time is 10ms

export default function timerDecrease({ gameState, clock }: ComputeEventProps<TimerDecreaseEvent>) {
	const timer = gameState.decreaseTimer();
	if (timer === 0) {
		const winner = (() => {
			const playerLostHp = gameState.playerMaxHp - gameState.playerHp;
			const opponentLostHp = gameState.opponentMaxHp - gameState.opponentHp;
			if (playerLostHp > opponentLostHp) {
				return "opponent";
			} else if (playerLostHp < opponentLostHp) {
				return "player";
			}
			return "draw";
		})();
		clock.triggerEvent({ type: "gameOver", winner })
	} else {
		clock.setGameEventTimeout({ type: "timerDecrease" }, TIMER_INCREASE_DELAY);
	}
}
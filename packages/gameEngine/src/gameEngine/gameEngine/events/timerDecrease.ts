import { TimerDecreaseEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export const TIMER_INCREASE_DELAY = 100; // frame time is 10ms

export default function timerDecrease({ gameState, clock }: ComputeEventProps<TimerDecreaseEvent>) {
	const timer = gameState.decreaseTimer();
	if (timer === 0) {
		const winnerIsPlayer = (() => {
			const playerLostHp = gameState.playerMaxHp - gameState.playerHp;
			const opponentLostHp = gameState.opponentMaxHp - gameState.opponentHp;
			if (playerLostHp > opponentLostHp) {
				return false;
			} else if (playerLostHp < opponentLostHp) {
				return true;
			} else if (gameState.playerMaxHp > gameState.opponentMaxHp) {
				return true;
			} else if (gameState.playerMaxHp < gameState.opponentMaxHp) {
				return false;
			}
			return false;
		})();
		clock.triggerEvent({ type: "gameOver", winnerIsPlayer })
	} else {
		clock.setGameEventTimeout({ type: "timerDecrease" }, TIMER_INCREASE_DELAY);
	}
}
import { useRef } from "react";
import useGameEventListener from "../card/useGameEventListener";
import { MAX_GAME_DURATION } from "game_engine";

export default function GameTimer() {
	const timerRef = useRef<HTMLParagraphElement>(null);

	useGameEventListener({
		type: "timerDecrease",
		action: (_, gameState) => {
			console.log("timerDecrease");
			if (timerRef.current) {
				const timer = gameState.getTimer();
				timerRef.current.textContent = timer.toString();
			}
		}
	});

	return (
		<p ref={timerRef}>{MAX_GAME_DURATION}</p>
	);
}
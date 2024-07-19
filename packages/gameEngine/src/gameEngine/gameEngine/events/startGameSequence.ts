import { StartGameSequence } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { defaultManaSpeed } from "../gameState";

export default function startGameSequence({ clock }: ComputeEventProps<StartGameSequence>) {
	const time = 30;
	clock.triggerEvent({ type: "setManaIncreaseSpeed", isPlayer: true, speed: time });
	clock.triggerEvent({ type: "setManaIncreaseSpeed", isPlayer: false, speed: time });
	clock.setGameEventTimeout({ type: "startEarningMana", isPlayer: true }, time);
	clock.setGameEventTimeout({ type: "startEarningMana", isPlayer: false }, time);
	clock.setGameEventTimeout({ type: "setManaIncreaseSpeed", isPlayer: true, speed: defaultManaSpeed }, time * 8);
	clock.setGameEventTimeout({ type: "setManaIncreaseSpeed", isPlayer: false, speed: defaultManaSpeed }, time * 8);
	const drawCardTime = time * 8 / 5;
	for (let i = 0; i < 4; i++) {
		const delay = drawCardTime * (i + 1);
		clock.setGameEventTimeout({ type: "drawCard", isPlayer: true, handPosition: i }, delay);
		clock.setGameEventTimeout({ type: "drawCard", isPlayer: false, handPosition: i }, delay);
	}
	clock.setGameEventTimeout({ type: "startGame" }, time * 8);
}
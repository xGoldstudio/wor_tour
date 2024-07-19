import { SetManaIncreaseSpeed } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function setManaIncreaseSpeed({ event, gameState }: ComputeEventProps<SetManaIncreaseSpeed>) {
	gameState.setIncreaseManaSpeed(event.isPlayer, event.speed);
}
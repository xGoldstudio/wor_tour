import { SetManaIncreaseSpeed } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function setManaIncreaseSpeed({ event, gameState }: ComputeEventProps<SetManaIncreaseSpeed>) {
	gameState.setIncreaseManaSpeed(event.isPlayer, event.speed);
}
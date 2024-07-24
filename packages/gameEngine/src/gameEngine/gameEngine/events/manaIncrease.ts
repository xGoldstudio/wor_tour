import { ManaIncreaseEvent } from "../../../types/eventType";
import { ComputeEventProps } from '../gameEngine';

export default function manaIncreaseEvent({ event, clock, gameState }: ComputeEventProps<ManaIncreaseEvent>) {
	gameState.increaseMana(event.isPlayer, event.value);
	if (event.isNaturalEarn) {
		gameState.resetEarningMana(event.isPlayer);
		clock.triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
	}
}
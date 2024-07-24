import { ManaIncreaseEvent } from "../../../types/eventType";
import { ComputeEventProps } from '../gameEngine';

export default function manaIncreaseEvent({ event, gameState }: ComputeEventProps<ManaIncreaseEvent>) {
	gameState.increaseMana(event.isPlayer, event.value);
}
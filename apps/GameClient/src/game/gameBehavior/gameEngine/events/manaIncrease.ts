import { ManaIncreaseEvent } from './../../useGameEvents';
import { ComputeEventProps } from '../gameEngine';

export default function manaIncreaseEvent({ event, clock, gameState }: ComputeEventProps<ManaIncreaseEvent>) {
	gameState.increaseMana(event.isPlayer);
	clock.triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
}
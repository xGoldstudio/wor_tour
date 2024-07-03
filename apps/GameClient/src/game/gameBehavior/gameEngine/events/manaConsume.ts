import { ComputeEventProps } from '../gameEngine';
import { ManaConsumeEvent } from './../../useGameEvents';

export default function manaConsumeEvent({ event, gameState, clock }: ComputeEventProps<ManaConsumeEvent>) {
	gameState.consumeMana(event.isPlayer, event.delta);
	clock.triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
}

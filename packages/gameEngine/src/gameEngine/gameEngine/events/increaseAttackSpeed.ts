import { IncreaseAttackSpeedEvent } from './../../../types/eventType';
import { ComputeEventProps } from "../gameEngine";

export const TIMER_INCREASE_DELAY = 100; // frame time is 10ms

export default function increaseAttackSpeed({ gameState, event, clock }: ComputeEventProps<IncreaseAttackSpeedEvent>) {
	// change card atack speed
	// change start attack
	gameState.increaseAttackSpeed(event.instanceId, event.increasePercent, clock.getImmutableInternalState().currentFrame);
	clock.triggerEvent({
		type: "cardStartAttacking",
		
	})
}
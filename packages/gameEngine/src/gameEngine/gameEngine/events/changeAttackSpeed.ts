import { ChangeAttackSpeedEvent } from '../../../types/eventType';
import { ComputeEventProps } from "../gameEngine";
import { getFrameFromAttackSpeed } from './utils';

export const TIMER_INCREASE_DELAY = 100; // frame time is 10ms

export default function changeAttackSpeed({ gameState, event, clock }: ComputeEventProps<ChangeAttackSpeedEvent>) {
	const card = gameState.getCardInstance(event.instanceId);
	const previousAttackSpeed = gameState.increaseAttackSpeed(event.instanceId, event.changePercent);
	if (previousAttackSpeed === undefined || card === null) {
		return;
	}
	const computedStartAttackSpeed = (() => {
		const currentFrame = clock.getImmutableInternalState().currentFrame;
		const card = gameState.getCardInstance(event.instanceId);
		if (card === null || card.startAttackingTick === null) {
			return undefined;
		}
		const progress = (currentFrame - card.startAttackingTick) / getFrameFromAttackSpeed(previousAttackSpeed);
		return Math.ceil(currentFrame - (getFrameFromAttackSpeed(card.attackSpeed) * progress));
	})();
	clock.triggerEvent({
		type: "cardStartAttacking",
		instanceId: event.instanceId,
		alreadyProcessing: computedStartAttackSpeed,
	});
}
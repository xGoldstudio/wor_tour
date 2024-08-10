import { CardStartAttackingEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function cardStartAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardStartAttackingEvent>) {
	const usingCard = gameState.getCardInstance(event.instanceId);
	if (!usingCard) {
		return;
	}
	const currentFrame = clock.getImmutableInternalState().currentFrame;
	if (usingCard.endAttackingTick !== null && usingCard.endAttackingTick > currentFrame) {
		const removedElements = clock.removeGameEventTimeout({
				type: "cardAttacking",
				instanceId: event.instanceId,
			}, usingCard.endAttackingTick,
		);
		if (removedElements !== 1) {
			console.error("increaseAttackSpeed a number different of 1 element has been removed", removedElements);
		}
	}
	let timeoutDuration = gameState.startAttacking(
		event.instanceId,
		event.alreadyProcessing ?? currentFrame,
	);
	if (timeoutDuration === null) {
		return;
	}
	if (event.alreadyProcessing !== undefined) {
		timeoutDuration = timeoutDuration - (currentFrame - event.alreadyProcessing);
	}
	clock.setGameEventTimeout(
		{
			type: "cardAttacking",
			instanceId: event.instanceId,
			cardIniator: usingCard,
		},
		timeoutDuration,
	);
}
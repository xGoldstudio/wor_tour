import { CardStartAttackingEvent, EventType } from "../../../types/eventType";
import { ClockReturn } from "../../clock/clock";
import { ComputeEventProps } from "../gameEngine";

export const CARD_ATTACK_ANIMATION_DURATION = 45;

export default function cardStartAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardStartAttackingEvent>) {
	const usingCard = gameState.getCardByInstance(event.instanceId);
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
	const attackDuration = gameState.startAttacking(
		event.instanceId,
		event.alreadyProcessing ?? currentFrame,
	);
	if (attackDuration === null) {
		return;
	}
	let timeRemainingBeforeAttack = attackDuration;
	if (event.alreadyProcessing !== undefined) {
		timeRemainingBeforeAttack = timeRemainingBeforeAttack - (currentFrame - event.alreadyProcessing);
	}
	clock.setGameEventTimeout(
		{
			type: "cardAttacking",
			instanceId: event.instanceId,
			cardIniator: usingCard,
		},
		timeRemainingBeforeAttack,
	);

	// attackAnimation
	if (usingCard.startAttackingAnimationTick !== null) {
		if (usingCard.startAttackingAnimationTick < currentFrame) { // after
			// no event is waiting
			const framesDone = currentFrame - usingCard.startAttackingAnimationTick;
			const totalFrame = usingCard.endAttackingTick! - usingCard.startAttackingAnimationTick!;
			const progress = framesDone / totalFrame;
			const adjustedTotal = Math.round(timeRemainingBeforeAttack / (1 - progress)) + 1; // make the animation slightly smoother and almost always no jump or jump forward (avoiding backgaward jump wich would be more noticeable)
			const newTarget = usingCard.endAttackingTick! - adjustedTotal;
			gameState.startAttackAnimation(event.instanceId, newTarget);
			clock.triggerEvent({ // elapsing the animation
				type: "cardStartAttackingAnimation",
				instanceId: event.instanceId,
				animationDuration: adjustedTotal,
				progressFrame: currentFrame - newTarget,
			});
		} else { // before (we must recompute the animation duration)
			const animationDuration = Math.min(timeRemainingBeforeAttack, CARD_ATTACK_ANIMATION_DURATION);
			const newTarget = usingCard.startAttackingTick! + attackDuration - animationDuration;
			if (newTarget === usingCard.startAttackingAnimationTick) {
				return;
			}
			removeCardAttackAnimation(usingCard.startAttackingAnimationTick, clock, event.instanceId);
			gameState.startAttackAnimation(event.instanceId, usingCard.endAttackingTick! - animationDuration);
			clock.setGameEventTimeout(
				{
					type: "cardStartAttackingAnimation",
					instanceId: event.instanceId,
					animationDuration,
					progressFrame: 0,
				},
				Math.max(0, timeRemainingBeforeAttack - animationDuration),
			);
		}
	} else { // first trigger
		const animationDuration = Math.min(timeRemainingBeforeAttack, CARD_ATTACK_ANIMATION_DURATION);
		gameState.startAttackAnimation(event.instanceId, usingCard.endAttackingTick! - animationDuration);
		clock.setGameEventTimeout(
			{
				type: "cardStartAttackingAnimation",
				instanceId: event.instanceId,
				animationDuration,
				progressFrame: 0,
			},
			Math.max(0, timeRemainingBeforeAttack - animationDuration),
		);
	}
}

function removeCardAttackAnimation(targetTick: number, clock: ClockReturn<EventType>, instanceId: number) {
	const removedElements = clock.removeGameEventTimeout({
		type: "cardStartAttackingAnimation",
		instanceId: instanceId,
	}, targetTick,
	);
	if (removedElements !== 1) {
		console.error("increaseAttackSpeed a number different of 1 element has been removed", removedElements);
	}
}
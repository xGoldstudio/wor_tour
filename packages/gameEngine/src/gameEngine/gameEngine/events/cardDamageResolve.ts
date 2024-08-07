import { CardDamagResolveEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function cardDamageResolveEvent({ gameState, clock, event }: ComputeEventProps<CardDamagResolveEvent>) {
	const isDead = gameState.dealDamageToCard(
		event.initiator.isPlayerCard,
		event.initiator.amount,
		event.initiator.cardPosition
	);
	if (event.initiator.directAttack) {
		event.initiator.onDirectHitStates.forEach((state) => {
			clock.triggerEvent({
				type: "triggerState",
				instanceId: event.initiator.initiator.instanceId,
				position: event.initiator.initiator.cardPosition,
				isPlayerCard: event.initiator.initiator.isPlayer,
				state,
				initiator: event,
				cardInitiator: event.initiator.cardInitiator,
			});
		});
		triggerStates({
			trigger: "onDirectlyAttacked",
			clock,
			gameState,
			isPlayerCard: event.initiator.isPlayerCard,
			cardPosition: event.initiator.cardPosition,
			initiator: event,
		});
	}
	if (isDead) {
		clock.triggerEvent({
			type: "cardDestroyed",
			initiator: event.initiator,
		});
	}
}
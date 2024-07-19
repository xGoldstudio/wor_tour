import { CardDamagResolveEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function cardDamageResolveEvent({ gameState, clock, event }: ComputeEventProps<CardDamagResolveEvent>) {
	const isDead = gameState.dealDamageToCard(
		event.initiator.isPlayerCard,
		event.initiator.amount,
		event.initiator.cardPosition
	);
	triggerStates({
		trigger: "onDirectAttackHit",
		clock,
		gameState,
		isPlayerCard: event.initiator.initiator.isPlayer,
		cardPosition: event.initiator.initiator.cardPosition,
		initiator: event,
	});
	triggerStates({
		trigger: "onDirectlyAttacked",
		clock,
		gameState,
		isPlayerCard: event.initiator.isPlayerCard,
		cardPosition: event.initiator.cardPosition,
		initiator: event,
	});
	if (isDead) {
		clock.triggerEvent({
			type: "cardDestroyed",
			initiator: event.initiator,
		});
	}
}
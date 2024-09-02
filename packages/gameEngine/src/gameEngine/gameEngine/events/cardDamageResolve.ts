import { CardDamagResolveEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function cardDamageResolveEvent({ gameState, clock, event }: ComputeEventProps<CardDamagResolveEvent>) {
	const isDead = gameState.dealDamageToCard(
		event.initiator.instanceId,
		event.damage,
	);
	if (event.initiator.directAttack) {
		event.initiator.onDirectHitStates.forEach((state) => {
			clock.triggerEvent({
				type: "triggerState",
				instanceId: event.initiator.initiator.instanceId,
				state,
				initiator: event,
				cardInitiator: event.initiator.cardInitiator,
			});
		});
		triggerStates({
			trigger: "onDirectlyAttacked",
			clock,
			gameState,
			initiator: event,
			instanceId: event.initiator.instanceId,
		});
	}
	if (isDead) {
		clock.triggerEvent({
			type: "beforeCardDestroyed",
			instanceId: event.initiator.instanceId,
		});
	}
}
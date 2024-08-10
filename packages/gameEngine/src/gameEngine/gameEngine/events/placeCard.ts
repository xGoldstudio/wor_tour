import { InGameCardType, PlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<PlaceCardEvent>) {
	const cardInGame: InGameCardType = {
		...event.card,
		hp: event.card.maxHp,
		attackSpeed: event.card.initialAttackSpeed,
		startAttackingTick: null,
		endAttackingTick: null,
		modifierOfAttackSpeedPercentage: 0,
		states: [],
		instanceId: gameState.getNextInstanceId(),
	}
	gameState.placeCardBoard(event.isPlayer, event.position, cardInGame);
	event.card.states.forEach((state) => {
		clock.triggerEvent({
			type: "addState",
			instanceId: cardInGame.instanceId,
			state,
		});
	});
	clock.triggerEvent({
		type: "cardStartAttacking",
		instanceId: cardInGame.instanceId,
	});
	clock.triggerEvent({
		type: "afterPlaceCard",
		instanceId: cardInGame.instanceId,
	})
}
import { AfterPlaceCardEvent, InGameCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

// this event is required to have state effectively added to the card  
export default function afterPlaceCard({ event, gameState, clock }: ComputeEventProps<AfterPlaceCardEvent>) {
	const cardInGame: InGameCardType = {
		...event.card,
		hp: event.card.maxHp,
		attackSpeed: event.card.initialAttackSpeed,
		startAttackingTick: null,
		endAttackingTick: null,
		startAttackingAnimationTick: null,
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
		type: "afterStatePlaceCard",
		instanceId: cardInGame.instanceId,
	});
}
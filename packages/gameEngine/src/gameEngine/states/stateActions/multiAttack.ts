import { StateAction } from "../CardStatesData";

const MultiAttackStateAction: StateAction = ({
	gameState, card, event, clock
}) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardAttacking") {
		return;
	}
	const cardPosition = gameState.getCardPosition(initiator.instanceId);
	if (cardPosition === null) {
		return;
	}
	gameState.getBoard(!cardPosition.isPlayerCard).forEach((boardCard, position) => {
		if (boardCard !== null && position !== cardPosition.position) {
			clock.triggerEvent({
				type: "cardDamage",
				amount: card.dmg,
				instanceId: boardCard.instanceId,
				directAttack: false,
				initiator: initiator,
				onDirectHitStates: [],
				cardInitiator: card,
			});
		}
	});
}

export default MultiAttackStateAction;
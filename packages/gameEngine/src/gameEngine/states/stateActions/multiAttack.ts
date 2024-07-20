import { StateAction } from "../CardStatesData";

const MultiAttackStateAction: StateAction = ({
	gameState, card, event, clock
}) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardAttacking") {
		return;
	}
	gameState.getBoard(!initiator.isPlayer).forEach((cardId, position) => {
		if (cardId !== null) {
			clock.triggerEvent({
				type: "cardDamage",
				amount: card.dmg,
				cardPosition: position,
				isPlayerCard: !initiator.isPlayer,
				directAttack: position === event.cardPosition,
				initiator: initiator,
			});
		}
	});
}

export default MultiAttackStateAction;
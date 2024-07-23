import { StateAction } from "../CardStatesData";

const MultiAttackStateAction: StateAction = ({
	gameState, card, event, clock
}) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardAttacking") {
		return;
	}
	gameState.getBoard(!initiator.isPlayer).forEach((boardCard, position) => {
		if (boardCard !== null && position !== initiator.cardPosition) {
			clock.triggerEvent({
				type: "cardDamage",
				amount: card.dmg,
				instanceId: boardCard.instanceId,
				cardPosition: position,
				isPlayerCard: !initiator.isPlayer,
				directAttack: false,
				initiator: initiator,
			});
		}
	});
}

export default MultiAttackStateAction;
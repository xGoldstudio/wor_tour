import { StateAction } from "../CardStatesData";

const HealStateAction: StateAction = ({ value, event, gameState, clock }) => {
	const initiator = event.initiator;
	if (initiator.type !== "placeCard" || value === null) {
		return;
	}
	const placedCard = gameState.getCard(initiator.isPlayer, initiator.position);
	if (placedCard === null) return;
	gameState.getBoard(initiator.isPlayer).forEach((card, position) => {
		if (!card || card.hp === card.maxHp || position === initiator.position) return;
		clock.triggerEvent({
			type: "healCard",
			instanceId: card.instanceId,
			cardInitiatorInstanceId: placedCard.instanceId,
			amount: value,
		});
	});
}

export default HealStateAction;
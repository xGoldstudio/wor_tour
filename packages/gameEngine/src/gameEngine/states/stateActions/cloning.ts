import { StateAction } from "../CardStatesData";

const CloningStateAction: StateAction = ({ clock, event, gameState, card }) => {
	const cardType = gameState.getCardTypeById(card.id);
	if (!cardType) {
		return;
	}
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayerCard,
		position: event.position,
		card: cardType,
		isSpecialPlacement: true,
	})
};

export default CloningStateAction;
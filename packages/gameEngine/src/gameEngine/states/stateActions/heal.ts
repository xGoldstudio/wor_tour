import { filterNulls } from '@repo/lib';
import { StateAction } from "../CardStatesData";

const HealStateAction: StateAction = ({ value, event, gameState, clock }) => {
	const initiator = event.initiator;
	if (initiator.type !== "placeCard" || value === null) {
		return;
	}
	filterNulls(gameState.getBoard(initiator.isPlayer)).forEach((card, position) => {
		if (card.hp === card.maxHp) return;
		clock.triggerEvent({
			type: "healCard",
			cardPosition: position,
			isPlayerCard: initiator.isPlayer,
			cardInitiator: {
				isPlayerCard: initiator.isPlayer,
				cardPosition: initiator.cardInHandPosition,
			},
			amount: value,
		});
	});
}

export default HealStateAction;
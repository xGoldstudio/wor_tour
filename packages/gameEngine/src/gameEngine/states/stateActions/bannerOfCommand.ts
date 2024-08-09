import { StateAction } from "../CardStatesData";

const BannerOfCommandStateAction: StateAction = ({ value, clock, event, gameState }) => {
	const initiator = event.initiator;
	if (initiator.type !== "placeCard" || value === null) {
		return;
	}
	// select all cards in the board including this one
	gameState.getBoard(initiator.isPlayer).forEach((card) => {
		if (!card) return;
		clock.triggerEvent({
			type: "increaseAttackSpeed",
			instanceId: card.instanceId,
			increasePercent: value,
		});
	});
};

export default BannerOfCommandStateAction;
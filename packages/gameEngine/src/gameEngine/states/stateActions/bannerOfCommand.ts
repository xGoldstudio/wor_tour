import { StateAction } from "../CardStatesData";

const BannerOfCommandStateAction: StateAction = ({ value, clock, event, gameState }) => {
	const initiator = event.initiator;
	if (initiator.type !== "afterPlaceCard" || value === null) {
		return;
	}
	// select all cards in the board including this one
	gameState.getBoardOfCard(initiator.instanceId)?.forEach((card) => {
		if (!card) return;
		clock.triggerEvent({
			type: "addState",
			instanceId: card.instanceId,
			state: {
				type: "rage",
				trigger: "idle",
				target: "selfCard",
				value: value,
			},
		})
	});
};

export default BannerOfCommandStateAction;
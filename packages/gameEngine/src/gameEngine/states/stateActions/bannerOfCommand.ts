import { StateAction } from "../CardStatesData";
import onAllyCardsTarget from "../utils/onAllyCardsTarget";
import onPlacementTrigger from "../utils/onPlacementTrigger";

const BannerOfCommandStateAction: StateAction = ({ value, clock, event, gameState }) => {
	const initiator = onPlacementTrigger(event);
	if (value === null) return;
	onAllyCardsTarget({ gameState, instanceId: initiator.instanceId })((card) => {
		clock.triggerEvent({
			type: "addState",
			instanceId: card.instanceId,
			state: {
				type: "rage",
				trigger: "idle",
				target: "selfCard",
				value: value,
			},
		});
	});
};

export default BannerOfCommandStateAction;
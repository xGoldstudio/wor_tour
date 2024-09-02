import { StateAction } from "../CardStatesData";
import onDirectAttackHit from "../utils/onDirectAttackHit";
import onEnnemyCardsTarget from "../utils/onEnnemyCardsTarget";

const FlameThrowerStateAction: StateAction = ({ value, clock, event, gameState }) => {
	const initiator = onDirectAttackHit(event);
	if (value === null) return;
	onEnnemyCardsTarget({ gameState, instanceId: initiator.initiator.initiator.instanceId })((card) => {
		clock.triggerEvent({
			type: "addState",
			instanceId: card.instanceId,
			state: {
				type: "scorch",
				trigger: "idle",
				target: "selfCard",
				value: value,
			},
		});
	});
};

export default FlameThrowerStateAction;
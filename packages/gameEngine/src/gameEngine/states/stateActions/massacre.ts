import { StateAction } from "../CardStatesData";

const MassacreStateAction: StateAction = ({ event, clock, value }) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardDamageResolve"
		|| initiator.initiator.directAttack === false
		|| value === null
	) {
		return;
	}
	clock.triggerEvent({
		type: "addState",
		instanceId: initiator.initiator.instanceId,
		position: initiator.initiator.cardPosition,
		isPlayerCard: initiator.initiator.isPlayerCard,
		state: {
			type: "bleeding",
			trigger: "onAttack",
			target: "selfCard",
			value: value,
		},
	})
}

export default MassacreStateAction;
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
		isPlayerCard: initiator.initiator.isPlayerCard,
		cardPosition: initiator.initiator.cardPosition,
		state: {
			type: "bleeding",
			trigger: "onAttack",
			target: "selfCard",
			value: value,
		},
	})
}

export default MassacreStateAction;
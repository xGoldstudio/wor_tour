import { StateAction } from "../CardStatesData";

const BleedingStateAction: StateAction = ({ event, clock, value }) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardAttacking" || value === null) {
		return;
	}
	clock.triggerEvent({
		type: "beforeCardDamageResolve", // The damage is instantly resolved
		initiator: {
			type: "cardDamage",
			amount: value,
			instanceId: initiator.instanceId,
			directAttack: false,
			initiator: initiator,
			onDirectHitStates: [],
			cardInitiator: initiator.cardIniator,
		}
	});
}

export default BleedingStateAction;
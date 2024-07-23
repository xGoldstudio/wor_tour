import { StateAction } from "../CardStatesData";

const BleedingStateAction: StateAction = ({ event, clock, value }) => {
	const initiator = event.initiator;
	if (initiator.type !== "cardAttacking" || value === null) {
		return;
	}
	clock.triggerEvent({
		type: "cardDamageResolve", // The damage is instantly resolved
		initiator: {
			type: "cardDamage",
			amount: value,
			instanceId: initiator.instanceId,
			cardPosition: initiator.cardPosition,
			isPlayerCard: initiator.isPlayer,
			directAttack: false,
			initiator: initiator,
		}
	});
}

export default BleedingStateAction;
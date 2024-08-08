import { StateAction } from "../CardStatesData";

const RiposteStateAction: StateAction = ({ clock, event, card }) => {
	const cardDamageResolveEvent = event.initiator;
	if (cardDamageResolveEvent.type !== "cardDamageResolve"
		|| cardDamageResolveEvent.initiator.directAttack === false
	) {
		return;
	}
	const attacker = cardDamageResolveEvent.initiator.initiator; // the one who attacked whill take damage
	const defender = cardDamageResolveEvent.initiator; // the one who was attacked will deal damage
	clock.triggerEvent({
		type: "cardDamage",
		amount: card.dmg,
		instanceId: attacker.instanceId,
		initiator: {
			type: "cardAttacking",
			instanceId: defender.instanceId,
			cardIniator: card,
		},
		onDirectHitStates: [],
		cardInitiator: { ...card },
		directAttack: false,
	});
}

export default RiposteStateAction;
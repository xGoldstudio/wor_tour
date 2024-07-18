import { StateAction } from "../CardStatesData";

const RiposteStateAction: StateAction = ({ clock, event, card }) => {
	const cardDamageResolveEvent = event.initiator;
	if (cardDamageResolveEvent.type !== "cardDamageResolve") {
		return;
	}
	clock.triggerEvent({
		type: "cardDamage",
		amount: card.dmg,
		cardPosition: cardDamageResolveEvent.initiator.initiator.cardPosition,
		isPlayerCard: cardDamageResolveEvent.initiator.initiator.isPlayerCard,
		initiator: cardDamageResolveEvent.initiator,
		directAttack: false,
	});
}

export default RiposteStateAction;
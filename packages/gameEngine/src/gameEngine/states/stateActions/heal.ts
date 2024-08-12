import { StateAction } from "../CardStatesData";

const HealStateAction: StateAction = ({ value, event, gameState, clock }) => {
	const initiator = event.initiator;
	if (initiator.type !== "afterStatePlaceCard" || value === null) {
		return;
	}
	gameState.getBoardOfCard(event.instanceId)?.forEach((card) => {
		if (!card || card.hp === card.maxHp || card.instanceId === event.instanceId) return;
		clock.triggerEvent({
			type: "healCard",
			instanceId: card.instanceId,
			cardInitiatorInstanceId: event.instanceId,
			amount: value,
		});
	});
}

export default HealStateAction;
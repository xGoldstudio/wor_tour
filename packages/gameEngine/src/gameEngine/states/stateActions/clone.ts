import { getRandomElement } from "@repo/lib";
import { PlaceCardType } from "../../../types/eventType";
import { StateAction } from "../CardStatesData";
import onDeathTrigger from "../utils/onDeathTrigger";
import onSelfCardTarget from "../utils/onSelfCardTarget";

const CloneStateAction: StateAction = ({ clock, event, gameState }) => {
	const initiator = onDeathTrigger(event);
	onSelfCardTarget({ gameState, instanceId: initiator.instanceId })(({ card, isPlayerCard }) => {
		const targetPosition = getRandomElement(
			gameState.getBoard(isPlayerCard)
				.flatMap((c, i) => c === null || c.instanceId === card.instanceId ? [i] : [])
		);
		const nextCard = purgeStates(card);
		const state = card.states.find(state => state.type === "clone");
		if (state && state.value !== null && state.value > 1) {
			state.value = state.value - 1;
			nextCard.states.push(state);
		}
		clock.triggerEvent({
			type: "placeCard",
			isPlayer: isPlayerCard,
			position: targetPosition,
			card: nextCard,
			isSpecialPlacement: true,
		});
	});
};

function purgeStates(card: PlaceCardType): PlaceCardType {
	return {
		...card,
		states: [],
	};
}

export default CloneStateAction;
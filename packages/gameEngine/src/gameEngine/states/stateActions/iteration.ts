import { BeforeNormalPlacementStateAction, StateAction } from "../CardStatesData";
import onPlacementTrigger from "../utils/onPlacementTrigger";

const IterationStateAction: StateAction = ({ clock, gameState, event }) => {
	const initiator = onPlacementTrigger(event);
	const state = gameState.getStateOfCardByInstanceId(initiator.instanceId, "iteration");
	const card = gameState.getCardByInstance(initiator.instanceId);
	if (typeof state?.value !== "number" || card === null) {
		return;
	}
	const deckCard = gameState.getDeckCardByInstanceId(card.initiatorId);
	if (!deckCard) {
		return;
	}
	clock.triggerEvent({
		type: "addDeckCardState", instanceId: deckCard.id, state: {
			type: "iteration",
			value: state.value,
			trigger: "onPlacement",
			target: "selfCard",
		}
	});
};

const BeforeNormalPlacementStateActionIteration: BeforeNormalPlacementStateAction = ({ card, gameState }) => {
	const state = gameState.extratStateOfCard(card, "iteration");
	if (!state?.value || state.value <= 0) {
		return card;
	}
	return {
		...card,
		maxHp: card.maxHp * (1.5 ** state.value),
		initialAttackSpeed: card.initialAttackSpeed * (1.5 ** state.value),
		dmg: card.dmg * (1.5 ** state.value),
	};
};

export {
	IterationStateAction,
	BeforeNormalPlacementStateActionIteration,
};
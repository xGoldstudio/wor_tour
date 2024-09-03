import { BeforeNormalPlacementStateAction, CardState } from "../CardStatesData";

const BeforeNormalPlacementStateActionIteration: BeforeNormalPlacementStateAction = ({ card, clock, event, gameState }) => {
	// const state = gameState.getStateOfDeckCardByInstaceId(event., "iteration");
	
	// clock.triggerEvent({
	// 	type: "addDeckCardStateValue",
	// 	state: {
	// 		...state,
	// 		value: state!.value! + 1
	// 	} as CardState,
	// 	instanceId: card.id,
	// });
	return card;
};

export default BeforeNormalPlacementStateActionIteration;
import { getRandomElement } from "@repo/lib";
import { PlaceCardType } from "../../../types/eventType";
import { StateAction } from "../CardStatesData";

const CloningStateAction: StateAction = ({ clock, event, card, gameState }) => {
	const board = gameState.getBoard(event.isPlayerCard);
	const freeZones: number[] = [];
	board.forEach((card, index) => {
		if (card === null) {
			freeZones.push(index);
		}
	});
	const targetPosition = getRandomElement(freeZones);
	const nextCard: PlaceCardType = {
		...card,
		hp: card.maxHp,
		states: [],
	};
	const state = card.states.find(state => state.type === "clone");
	if (state) {
		state.value = state.value - 1;
		if (state.value > 0) {
			nextCard.states.push(state);
		}
	}
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayerCard,
		position: targetPosition,
		card: nextCard,
		isSpecialPlacement: true,
	})
};

export default CloningStateAction;
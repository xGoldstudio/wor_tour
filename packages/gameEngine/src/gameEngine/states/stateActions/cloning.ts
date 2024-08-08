import { getRandomElement } from "@repo/lib";
import { PlaceCardType } from "../../../types/eventType";
import { StateAction } from "../CardStatesData";

const CloningStateAction: StateAction = ({ clock, event, card, gameState }) => {
	return;
	if (event.initiator.type !== "cardDestroyed") return;
	const isPlayerCard = gameState.getIsPlayerCard(event.initiator.initiator.instanceId);
	const board = gameState.getBoard(isPlayerCard);
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
		isPlayer: isPlayerCard,
		position: targetPosition,
		card: nextCard,
		isSpecialPlacement: true,
	})
};

export default CloningStateAction;
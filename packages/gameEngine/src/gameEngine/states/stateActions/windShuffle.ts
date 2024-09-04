import { HAND_SIZE } from "../../gameEngine/gameState";
import { StateAction } from "../CardStatesData";
import onPlacementTrigger from "../utils/onPlacementTrigger";

const WindShuffleStateAction: StateAction = ({ clock, gameState, event }) => {
	const initiator = onPlacementTrigger(event);
	const isPlayer = gameState.getIsPlayerCard(initiator.instanceId);
	gameState.discardHand(isPlayer);
	clock.triggerEvent({ type: "shuffleDeck", isPlayer });
	for (let i = 0; i < HAND_SIZE; i++) {
		clock.setGameEventTimeout({ type: "drawCard", isPlayer, position: i }, 0);
	}
};

export default WindShuffleStateAction;
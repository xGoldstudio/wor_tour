import { CARD_ATTACK_ANIMATION_DURATION } from "../../gameEngine/events/cardStartAttacking";
import { StateAction } from "../CardStatesData";
import onAllyCardsTarget from "../utils/onAllyCardsTarget";
import onPlacementTrigger from "../utils/onPlacementTrigger";

const RushStateAction: StateAction = ({ clock, gameState, event }) => {
	const initiator = onPlacementTrigger(event);
	onAllyCardsTarget({ gameState, instanceId: initiator.instanceId })((card) => {
		if (card.startAttackingTick === null || card.endAttackingTick === null) return;
		const framesRemaining = card.endAttackingTick - clock.getImmutableInternalState().currentFrame;
		if (framesRemaining <= CARD_ATTACK_ANIMATION_DURATION) return; // already attacking
		const attackDuration = card.endAttackingTick - card.startAttackingTick;
		clock.triggerEvent({
			type: "cardStartAttacking",
			instanceId: card.instanceId,
			alreadyProcessing: clock.getImmutableInternalState().currentFrame - attackDuration + CARD_ATTACK_ANIMATION_DURATION,
		})
	});
};

export default RushStateAction;
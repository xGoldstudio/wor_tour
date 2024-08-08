import { CardStartAttackingEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getFrameFromAttackSpeed } from "./utils";

export default function cardStartAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardStartAttackingEvent>) {
	const usingCard = gameState.getCardInstance(event.instanceId);
	if (!usingCard) {
		return;
	}
	gameState.startAttacking(
		event.instanceId,
		clock.getImmutableInternalState().currentFrame
	);
	clock.setGameEventTimeout(
		{
			type: "cardAttacking",
			instanceId: event.instanceId,
			cardIniator: usingCard,
		},
		getFrameFromAttackSpeed(usingCard.attackSpeed)
	);
}
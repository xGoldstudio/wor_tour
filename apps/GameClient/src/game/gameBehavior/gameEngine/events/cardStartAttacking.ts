import { CardStartAttackingEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";
import { getFrameFromAttackSpeed } from "./utils";

export default function cardStartAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardStartAttackingEvent>) {
	const usingCard = event.isPlayer
		? gameState.playerBoard[event.cardPosition]
		: gameState.opponentBoard[event.cardPosition];
	if (!usingCard) {
		return;
	}
	gameState.startAttacking(
		event.isPlayer,
		event.cardPosition,
		clock.getImmutableInternalState().currentFrame
	);
	clock.setGameEventTimeout(
		{
			type: "cardAttacking",
			isPlayer: event.isPlayer,
			instanceId: event.instanceId,
			cardPosition: event.cardPosition,
		},
		getFrameFromAttackSpeed(usingCard.attackSpeed)
	);
}
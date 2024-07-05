import { CardDamagResolveEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function cardDamageResolveEvent({ gameState, clock, event }: ComputeEventProps<CardDamagResolveEvent>) {
	const isDead = gameState.dealDamageToCard(
		event.initiator.isPlayerCard,
		event.initiator.amount,
		event.initiator.cardPosition
	);
	if (event.initiator.directAttack) {
		const card = (
			event.initiator.isPlayerCard ? gameState.playerBoard : gameState.opponentBoard
		)[event.initiator.cardPosition];
		if (card?.effects.fightBack) {
			// attack before destroying the card
			clock.triggerEvent({
				// to avoid infinite ping pong
				type: "removeEffect",
				isPlayerCard: event.initiator.isPlayerCard,
				cardPosition: event.initiator.cardPosition,
				effectToRemove: "fightBack",
			});
			clock.triggerEvent({
				type: "cardDamage",
				amount: card.dmg,
				cardPosition: event.initiator.initiator.cardPosition,
				isPlayerCard: event.initiator.initiator.isPlayerCard,
				initiator: event.initiator,
				directAttack: true,
			});
		}
	}
	if (isDead) {
		clock.triggerEvent({
			type: "cardDestroyed",
			initiator: event.initiator,
		});
	}
}
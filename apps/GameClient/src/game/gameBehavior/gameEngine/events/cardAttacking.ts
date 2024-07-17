import { CardAttackingEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function cardAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardAttackingEvent>) {
	const attakerCard = event.isPlayer
		? gameState.playerBoard[event.cardPosition]
		: gameState.opponentBoard[event.cardPosition];
	const defenseBoard = event.isPlayer ? gameState.opponentBoard : gameState.playerBoard;
	const defenseCard = defenseBoard[event.cardPosition];
	if (attakerCard === null || attakerCard.instanceId !== event.instanceId) {
		// if card destroyed or replaced during attack
		return;
	}
	// if (attakerCard.effects.multiAttack) {
	// 	// multi attack will attack all cards on board + player if no direct defenser
	// 	defenseBoard.forEach((cardId, position) => {
	// 		if (cardId !== null) {
	// 			clock.triggerEvent({
	// 				type: "cardDamage",
	// 				amount: attakerCard.dmg,
	// 				cardPosition: position,
	// 				isPlayerCard: !event.isPlayer,
	// 				directAttack: position === event.cardPosition,
	// 				initiator: {
	// 					cardPosition: event.cardPosition,
	// 					isPlayerCard: event.isPlayer,
	// 				},
	// 			});
	// 		}
	// 	});
	// 	if (!defenseCard) {
	// 		clock.triggerEvent({
	// 			type: "playerDamage",
	// 			damage: attakerCard.dmg,
	// 			isPlayer: !event.isPlayer,
	// 			initiator: event,
	// 		});
	// 	}
	// } else {
	if (defenseCard) {
		clock.triggerEvent({
			type: "cardDamage",
			amount: attakerCard.dmg,
			cardPosition: event.cardPosition,
			isPlayerCard: !event.isPlayer,
			directAttack: true,
			initiator: {
				cardPosition: event.cardPosition,
				isPlayerCard: event.isPlayer,
			},
		});
	} else {
		clock.triggerEvent({
			type: "playerDamage",
			damage: attakerCard.dmg,
			isPlayer: !event.isPlayer,
			initiator: event,
		});
	}
	// }
	clock.triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.cardPosition,
		instanceId: event.instanceId,
	});
}
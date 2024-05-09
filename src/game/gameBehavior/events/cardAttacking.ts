import { GameStore } from "@/stores/gameStateInterface";
import { CardAttackingEvent, TriggerEventType } from "../useGameEvents";

export default function cardAttacking(event: CardAttackingEvent, data: GameStore, triggerEvent: TriggerEventType) {
	const attakerCard = event.isPlayer
		? data.playerBoard[event.cardPosition]
		: data.opponentBoard[event.cardPosition];
	const defenseBoard = event.isPlayer
		? data.opponentBoard
		: data.playerBoard;
	const defenseCard = defenseBoard[event.cardPosition];
	if (attakerCard === null || attakerCard.instanceId !== event.instanceId) {
		// if card destroyed or replaced during attack
		return;
	}
	if (attakerCard.effects.multiAttack) { // multi attack will attack all cards on board + player if no direct defenser
		defenseBoard.forEach((cardId, position) => {
			if (cardId !== null) {
				triggerEvent({
					type: "cardDamage",
					amount: attakerCard.dmg,
					cardPosition: position,
					isPlayerCard: !event.isPlayer,
					directAttack: position === event.cardPosition,
					initiator: {
						cardPosition: event.cardPosition,
						isPlayerCard: event.isPlayer,
					},
				});
			}
		});
		if (!defenseCard) {
			triggerEvent({
				type: "playerDamage",
				damage: attakerCard.dmg,
				isPlayer: !event.isPlayer,
				initiator: event,
			});
		}
	} else {
		if (defenseCard) {
			triggerEvent({
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
			triggerEvent({
				type: "playerDamage",
				damage: attakerCard.dmg,
				isPlayer: !event.isPlayer,
				initiator: event,
			});
		}
	}
	triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.cardPosition,
		instanceId: event.instanceId,
	});
}
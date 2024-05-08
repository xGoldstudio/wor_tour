import { GameStore, InGameCardType } from "@/stores/gameStateInterface";
import { CardAttackingEvent, TriggerEventType } from "../useGameEvents";
import { CardEffect } from "@/cards";

function findEffect(card: InGameCardType, effectToFind: CardEffect): boolean {
	return card.effects.findIndex(effect => effect === effectToFind) !== -1
}

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
	if (findEffect(attakerCard, "multiAttack")) { // multi attack will attack all cards on board + player if no direct defenser
		defenseBoard.forEach((cardId, position) => {
			if (cardId !== null) {
				triggerEvent({
					type: "cardDamage",
					amount: attakerCard.dmg,
					cardPosition: position,
					isPlayerCard: !event.isPlayer,
					initiator: event,
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
				initiator: event,
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
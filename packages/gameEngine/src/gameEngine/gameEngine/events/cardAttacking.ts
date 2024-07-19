import { CardAttackingEvent, EventType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { ClockReturn } from "../../clock/clock";
import { GameStateObject } from "../gameState";
import { CardState } from "../../states/CardStatesData";

export function triggerStates({ gameState, trigger, clock, isPlayerCard, cardPosition, initiator }: {
	gameState: GameStateObject,
	trigger: CardState["trigger"],
	clock: ClockReturn<EventType>,
	isPlayerCard: boolean,
	cardPosition: number,
	initiator: EventType,
}) {
	const card = gameState.getCard(isPlayerCard, cardPosition);
	if (card === null) {
		return;
	}
	card.states.forEach((state) => {
		if (state.trigger === trigger) {
			clock.triggerEvent({
				type: "triggerState",
				isPlayerCard,
				cardPosition,
				state,
				initiator: initiator,
			});
		}
	});
}

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
	triggerStates({
		trigger: "onAttack",
		clock,
		gameState,
		isPlayerCard: event.isPlayer,
		cardPosition: event.cardPosition,
		initiator: event,
	});
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
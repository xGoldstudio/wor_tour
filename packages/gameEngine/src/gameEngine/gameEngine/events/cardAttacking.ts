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
				instanceId: card.instanceId,
				position: cardPosition,
				isPlayerCard: isPlayerCard,
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
	if (defenseCard) {
		clock.triggerEvent({
			type: "cardDamage",
			amount: attakerCard.dmg,
			cardPosition: event.cardPosition,
			instanceId: defenseCard.instanceId,
			isPlayerCard: !event.isPlayer,
			directAttack: true,
			initiator: event,
		});
	} else {
		clock.triggerEvent({
			type: "playerDamage",
			damage: attakerCard.dmg,
			isPlayer: !event.isPlayer,
			initiator: event,
		});
	}
	clock.triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.cardPosition,
		instanceId: event.instanceId,
	});
}
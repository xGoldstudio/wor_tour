import { CardAttackingEvent, EventType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { ClockReturn } from "../../clock/clock";
import { GameStateObject } from "../gameState";
import { CardState } from "../../states/CardStatesData";

export function triggerStates({ gameState, trigger, clock, initiator, instanceId }: {
	gameState: GameStateObject,
	trigger: CardState["trigger"],
	clock: ClockReturn<EventType>,
	initiator: EventType,
	instanceId: number,
}) {
	const card = gameState.getCardInstance(instanceId);
	if (card === null) {
		return;
	}
	card.states.forEach((state) => {
		if (state.trigger === trigger) {
			clock.triggerEvent({
				type: "triggerState",
				instanceId: card.instanceId,
				state,
				initiator: initiator,
				cardInitiator: card,
			});
		}
	});
}

export default function cardAttackingEvent({ event, gameState, clock }: ComputeEventProps<CardAttackingEvent>) {
	const attakerCard = gameState.getCardInstance(event.instanceId);
	const isPlayerCard = gameState.getIsPlayerCard(event.instanceId);
	const defenseCard = gameState.getOppositeCard(event.instanceId);
	if (attakerCard === null) {
		// if card destroyed or replaced during attack
		return;
	}
	triggerStates({
		trigger: "onAttack",
		clock,
		gameState,
		initiator: event,
		instanceId: event.instanceId,
	});
	if (defenseCard) {
		clock.triggerEvent({
			type: "cardDamage",
			amount: attakerCard.dmg,
			instanceId: defenseCard.instanceId,
			directAttack: true,
			initiator: event,
			onDirectHitStates: attakerCard.states.filter((state) => state.trigger === "onDirectAttackHit").map((state) => ({ ...state })), // we take the state at its current state
			cardInitiator: attakerCard,
		});
	} else {
		clock.triggerEvent({
			type: "playerDamage",
			damage: attakerCard.dmg,
			isPlayer: !isPlayerCard,
			initiator: event,
		});
	}
	clock.triggerEvent({
		type: "cardStartAttacking",
		instanceId: event.instanceId,
	});
}
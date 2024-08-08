import { InGameCardType, PlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import _ from "lodash";
import { triggerStates } from "./cardAttacking";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<PlaceCardEvent>) {
	const cardInGame: InGameCardType = {
		id: event.card.id,
		maxHp: event.card.hp,
		hp: event.card.hp,
		dmg: event.card.dmg,
		attackSpeed: event.card.attackSpeed,
		startAttackingTick: null,
		instanceId: gameState.getNextInstanceId(),
		rarity: event.card.rarity,
		states: _.cloneDeep(event.card.states) || [],
		illustration: event.card.illustration,
		worldIllustration: event.card.worldIllustration,
	};
	gameState.placeCardBoard(event.isPlayer, event.position, cardInGame);
	triggerStates({
		trigger: "onPlacement",
		clock,
		gameState,
		isPlayerCard: event.isPlayer,
		cardPosition: event.position,
		initiator: event,
	});
	clock.triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.position,
		instanceId: cardInGame.instanceId,
	});
}
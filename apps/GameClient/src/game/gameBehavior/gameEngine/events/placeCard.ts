import { InGameCardType } from "@/game/stores/gameStateStore";
import { PlaceCardEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";
import _ from "lodash";
import { triggerStates } from "./cardAttacking";

export default function placeCardEvent({ event, gameState, clock }: ComputeEventProps<PlaceCardEvent>) {
	const card = event.isPlayer
	? gameState.playerHand[event.cardInHandPosition]
	: gameState.opponentHand[event.cardInHandPosition];
	if (card === null) {
		throw new Error("Card not found in hand");
	}
	const cardInGame: InGameCardType = {
		id: card.id,
		maxHp: card.hp,
		hp: card.hp,
		dmg: card.dmg,
		attackSpeed: card.attackSpeed,
		startAttackingTick: null,
		instanceId: gameState.getNextInstanceId(),
		rarity: card.rarity,
		states: _.cloneDeep(card.states) || [],
		illustration: card.illustration,
		worldIllustration: card.worldIllustration,
	};
	clock.triggerEvent({
		type: "manaConsume",
		isPlayer: event.isPlayer,
		delta: card.cost,
	});
	gameState.placeCardBoard(event.isPlayer, event.targetPosition, cardInGame);
	triggerStates({
		trigger: "onPlacement",
		clock,
		gameState,
		isPlayerCard: event.isPlayer,
		cardPosition: event.targetPosition,
		initiator: event,
	});
	// if (cardInGame.effects.placementHeal) {
	// 	const board = event.isPlayer
	// 		? [...gameState.playerBoard]
	// 		: [...gameState.opponentBoard];
	// 	board.forEach((card, position) => {
	// 		if (card === null || position === event.targetPosition) {
	// 			return;
	// 		}
	// 		clock.triggerEvent({
	// 			type: "healCard",
	// 			cardPosition: position,
	// 			isPlayerCard: event.isPlayer,
	// 			cardInitiator: {
	// 				isPlayerCard: event.isPlayer,
	// 				cardPosition: event.targetPosition,
	// 			},
	// 			amount: cardInGame.effects.placementHeal!.amount,
	// 		});
	// 	});
	// 	clock.triggerEvent({
	// 		type: "removeEffect",
	// 		isPlayerCard: event.isPlayer,
	// 		cardPosition: event.targetPosition,
	// 		effectToRemove: "placementHeal",
	// 	});
	// }
	clock.triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.targetPosition,
		instanceId: cardInGame.instanceId,
	});
	clock.triggerEvent({
		type: "drawCard",
		isPlayer: event.isPlayer,
		handPosition: event.cardInHandPosition,
	});
}
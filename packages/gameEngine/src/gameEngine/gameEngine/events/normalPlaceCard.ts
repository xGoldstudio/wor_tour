import _ from "lodash";
import { NormalPlaceCardEvent, PlaceCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function normalPlaceCardEvent({ event, gameState, clock }: ComputeEventProps<NormalPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = event.isPlayer
	? gameState.playerHand[event.cardInHandPosition]
	: gameState.opponentHand[event.cardInHandPosition];
	if (card === null) {
		throw new Error("Card not found in hand");
	}
	const cardInGame: PlaceCardType = {
		id: card.id,
		maxHp: card.hp,
		hp: card.hp,
		dmg: card.dmg,
		attackSpeed: card.attackSpeed,
		initialAttackSpeed: card.attackSpeed,
		modifierOfAttackSpeedPercentage: 0,
		startAttackingTick: null,
		endAttackingTick: null,
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
	clock.triggerEvent({
		type: "drawCard",
		isPlayer: event.isPlayer,
		handPosition: event.cardInHandPosition,
	});
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayer,
		position: event.position,
		card: cardInGame,
		isSpecialPlacement: false,
	})
}
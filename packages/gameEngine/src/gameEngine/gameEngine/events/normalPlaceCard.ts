import _ from "lodash";
import { NormalPlaceCardEvent, PlaceCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { CardType } from "@repo/lib";

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
		card: placeCardFromCardType(card),
		isSpecialPlacement: false,
	})
}

export function placeCardFromCardType(card: CardType): PlaceCardType {
	return {
		id: card.id,
		maxHp: card.hp,
		dmg: card.dmg,
		initialAttackSpeed: card.attackSpeed,
		rarity: card.rarity,
		states: _.cloneDeep(card.states) || [],
		illustration: card.illustration,
		worldIllustration: card.worldIllustration,
	};
}
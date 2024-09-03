import _ from "lodash";
import { NormalPlaceCardEvent, PlaceCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { CardType } from "@repo/lib";

export default function normalPlaceCardEvent({ event, gameState, clock }: ComputeEventProps<NormalPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = gameState.getDeckCardByInstanceId(event.instanceId);
	if (!card) {
		throw new Error("Card not found in hand");
	}
	const positionOfCardInHand = gameState.getPositionInHand(event.instanceId, event.isPlayer);
	if (positionOfCardInHand === -1) {
		console.warn("Card already placed");
		return;
	}
	if (card.cost > gameState.getMana(event.isPlayer)) {
		console.warn("Not enough mana");
		return;
	}
	clock.triggerEvent({
		type: "manaConsume",
		isPlayer: event.isPlayer,
		delta: card.cost,
	});
	clock.triggerEvent({
		type: "drawCard",
		isPlayer: event.isPlayer,
		handPosition: positionOfCardInHand,
	});
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayer,
		position: event.position,
		card: placeCardFromCardType(card),
		isSpecialPlacement: false,
	});
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
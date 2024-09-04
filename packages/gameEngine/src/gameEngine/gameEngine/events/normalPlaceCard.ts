import _ from "lodash";
import { EventType, NormalPlaceCardEvent, PlaceCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { CardType } from "@repo/lib";
import { getOptionsFromType } from "../../states/CardStatesData";
import { ClockReturn } from "../../clock/clock";
import { GameStateObject, MAX_ATTACK_SPEED, MIN_ATTACK_SPEED } from "../gameState";

export default function normalPlaceCardEvent({ event, gameState, clock }: ComputeEventProps<NormalPlaceCardEvent>) {
	if (!gameState.isStarted) {
		return;
	}
	const card = gameState.getDeckCardByInstanceId(event.instanceId);
	if (!card) {
		throw new Error("Card not found in hand");
	}
	const positionOfCardInHand = gameState.getPositionInHand(event.instanceId, event.isPlayer);
	clock.triggerEvent({
		type: "manaConsume",
		isPlayer: event.isPlayer,
		delta: card.cost,
	});
	if (positionOfCardInHand !== -1) {
		clock.triggerEvent({
			type: "drawCard",
			isPlayer: event.isPlayer,
			position: positionOfCardInHand,
		});
	}
	clock.triggerEvent({
		type: "placeCard",
		isPlayer: event.isPlayer,
		position: event.position,
		card: computePlacementCard(card, clock, gameState, event),
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
		initiatorId: card.id,
	};
}

function computePlacementCard(card: CardType, clock: ClockReturn<EventType>, gameState: GameStateObject, event: NormalPlaceCardEvent) {
	const placementCard = placeCardFromCardType(card);
	const modifiedPlacementcard = placementCard.states.reduce((acc, state) => {
		const option = getOptionsFromType(state.type);
		if (option.onBeforeNormalPlacement) {
			return option.onBeforeNormalPlacement({ clock, gameState, card: acc, event });
		}
		return acc;
	}	, placementCard);
	// limits
	modifiedPlacementcard.initialAttackSpeed = Math.min(
		MAX_ATTACK_SPEED,
		Math.max(MIN_ATTACK_SPEED, modifiedPlacementcard.initialAttackSpeed)
	);
	modifiedPlacementcard.maxHp = Math.max(1, Math.floor(modifiedPlacementcard.maxHp));
	modifiedPlacementcard.dmg = Math.floor(modifiedPlacementcard.dmg);
	return modifiedPlacementcard;
}
import { PlaceCardEvent } from "../useGameEvents";
import { GameStore, InGameCardType } from "@/game/stores/gameStateStore";
import useGameMetadataStore from "@/game/stores/gameMetadataStore";
import * as _ from "lodash";
import { TriggerEventType } from "../gameEventListener";

export default function cardPlacementEventManager(
	event: PlaceCardEvent,
	data: GameStore,
	triggerEvent: TriggerEventType,
	getNextInstanceId: () => number,
	placeCardBoard: (
    isPlayer: boolean,
    position: number,
    card: InGameCardType
  ) => void
) {
	const foundCard = useGameMetadataStore.getState().findCard(event.cardId, event.isPlayer);
	const cardInGame: InGameCardType = {
		id: foundCard.id,
		maxHp: foundCard.hp,
		hp: foundCard.hp,
		dmg: foundCard.dmg,
		attackSpeed: foundCard.attackSpeed,
		startAttackingTick: null,
		instanceId: getNextInstanceId(),
		rarity: foundCard.rarity,
		effects: _.cloneDeep(foundCard.effects) || {},
		illustration: foundCard.illustration,
		worldIllustration: foundCard.worldIllustration,
	};
	triggerEvent({
		type: "manaConsume",
		isPlayer: event.isPlayer,
		delta: foundCard.cost,
	});
	placeCardBoard(event.isPlayer, event.targetPosition, cardInGame);
	if (cardInGame.effects.placementHeal) {
		const board = event.isPlayer ? [...data.playerBoard] : [...data.opponentBoard];
		board.forEach((card, position) => {
			if (card === null || position === event.targetPosition) {
				return;
			}
			triggerEvent({
				type: "healCard",
				cardPosition: position,
				isPlayerCard: event.isPlayer,
				cardInitiator: {
					isPlayerCard: event.isPlayer,
					cardPosition: event.targetPosition,
				},
				amount: cardInGame.effects.placementHeal!.amount,
			});
		});
	}
	triggerEvent({
		type: "cardStartAttacking",
		isPlayer: event.isPlayer,
		cardPosition: event.targetPosition,
		instanceId: cardInGame.instanceId,
	});
	triggerEvent({
		type: "drawCard",
		isPlayer: event.isPlayer,
		handPosition: event.cardInHandPosition,
	});
}
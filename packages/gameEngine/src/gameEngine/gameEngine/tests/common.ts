import { GameStateObject } from "../gameState";
import _ from "lodash";
import { EventType } from "../../../types/eventType";
import Clock, { ClockReturn } from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";
import { CardType } from "../../../types/Card";
import { CardState } from "../../states/CardStatesData";
import { DAMAGE_SPEED } from "../events/cardDamage";

export const defaultTestDamage = 100;
export const defaultTestHp = 200;
export const defaultTestAttackSpeed = 1;

export const baseCard: CardType = {
	name: "string",
	cost: 1,
	illustration: "string",
	worldIllustration: "string",
	dmg: defaultTestDamage,
	hp: defaultTestHp,
	attackSpeed: defaultTestAttackSpeed,
	states: [],
	level: 1,
	world: 1,
	rarity: "common",
	id: 0,
}

export const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

export function initTest(playerDeck?: CardType[]) {
	const state = new GameStateObject({ playerDeck: playerDeck ?? deck, opponentDeck: deck, playerHp: 200, opponentHp: 200 });
	const clock = Clock<EventType>(
		(event, clock) => {
			computeNextFrameState(state, event, clock);
		}
	);
	return { state, clock };
}

export function drawPlaceCard(clock: ClockReturn<EventType>, isPlayer: boolean, position: number) {
	clock.triggerEvent({ type: "drawCard", isPlayer: isPlayer, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: isPlayer, targetPosition: position, cardInHandPosition: 0 });
}

export const multiAttackState: CardState = {
	type: "multiAttack",
	value: null,
	trigger: "onAttack",
	target: "otherEnnemyCards",
};

export const healStateDefaultTest: CardState = {
	type: "heal",
	value: 100,
	trigger: "onPlacement",
	target: "allyCards",
};

export function triggerDirectAttack(
	clock: ClockReturn<EventType>,
	state: GameStateObject,
	isPlayer: boolean,
	cardPosition: number,
) {
	clock.triggerEvent({
		type: "cardAttacking",
		isPlayer,
		cardPosition,
		instanceId: state.getCard(isPlayer, cardPosition)!.instanceId
	});
}

export function attackAnimation(clock: ClockReturn<EventType>) {
	for (let i = 0; i < DAMAGE_SPEED; i++) {
		clock.nextTick();
	}
}
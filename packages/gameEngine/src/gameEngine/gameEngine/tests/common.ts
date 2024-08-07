import { GameStateObject, GameStateObjectConstructor } from "../gameState";
import _ from "lodash";
import { EventType, InGameCardType } from "../../../types/eventType";
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

export function initTest({ gameData, sideEffectOnEvent, skipStartGame }: {
	gameData?: Partial<GameStateObjectConstructor>,
	sideEffectOnEvent?: ({ state, clock, event }: {
		state: GameStateObject;
		clock: ClockReturn<EventType>;
		event: EventType;
	}) => void,
	skipStartGame?: boolean,
}) {
	const state = new GameStateObject({
		playerDeck: gameData?.playerDeck ?? deck,
		opponentDeck: gameData?.opponentDeck ?? deck,
		playerHp: gameData?.playerHp ?? 200,
		opponentHp: gameData?.opponentHp ?? 200,
	});
	const clock = Clock<EventType>(
		(event, clock) => {
			computeNextFrameState(state, event, clock);
			sideEffectOnEvent?.({ state, clock, event });
		}
	);
	if (skipStartGame) {
		clock.triggerEvent({ type: "startGame" });
	}
	return { state, clock };
}

export function drawPlaceCard(clock: ClockReturn<EventType>, isPlayer: boolean, position: number) {
	clock.triggerEvent({ type: "drawCard", isPlayer: isPlayer, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: isPlayer, position: position, cardInHandPosition: 0 });
}

export const multiAttackState: CardState = {
	type: "multiAttack",
	value: null,
	trigger: "onAttack",
	target: "otherEnnemyCards",
};

export const riposteStateTest: CardState = {
	type: "riposte",
	value: 1,
	trigger: "onDirectlyAttacked",
	target: "directEnnemyCard",
};

export const healStateDefaultTest: CardState = {
	type: "heal",
	value: 100,
	trigger: "onPlacement",
	target: "allyCards",
};

export const bleedingStateTest: CardState = {
	type: "bleeding",
	value: 10,
	trigger: "onAttack",
	target: "selfCard",
};

export const massacreStateTest: CardState = {
	type: "massacre",
	value: 10,
	trigger: "onDirectAttackHit",
	target: "directEnnemyCard",
};

export function triggerDirectAttack(
	clock: ClockReturn<EventType>,
	state: GameStateObject,
	isPlayer: boolean,
	cardPosition: number,
	doAnimation?: boolean,
) {
	clock.triggerEvent({
		type: "cardAttacking",
		isPlayer,
		cardPosition,
		instanceId: state.getCard(isPlayer, cardPosition)!.instanceId,
		cardIniator: state.getCard(isPlayer, cardPosition)!,
	});
	if (doAnimation) {
		attackAnimation(clock);
	}
}

export function triggerHealCard(
	clock: ClockReturn<EventType>,
	isPlayerCard: boolean,
	cardPosition: number,
	amount: number,
) {
	clock.triggerEvent({
		type: "healCard",
		isPlayerCard,
		cardPosition,
		amount,
		cardInitiator: {
			isPlayerCard,
			cardPosition,
		}
	})
}

export function triggerDirectAttackResolved(
	clock: ClockReturn<EventType>,
	state: GameStateObject,
	isPlayer: boolean,
	cardPosition: number,
	damage: number,
	notDirect?: true,
) {
	clock.triggerEvent({
		type: "cardDamageResolve",
		initiator: {
			type: "cardDamage",
			instanceId: getInstanceId(state, !isPlayer, cardPosition),
			directAttack: !notDirect,
			isPlayerCard: !isPlayer,
			cardPosition,
			amount: damage,
			initiator: {
				type: "cardAttacking",
				isPlayer,
				cardPosition,
				instanceId: -1,
				cardIniator: state.getCard(isPlayer, cardPosition)!,
			},
			cardInitiator: state.getCard(isPlayer, cardPosition)!,
			onDirectHitStates: [],
		}
	});
}

export function triggerStartEarningMana(
	clock: ClockReturn<EventType>,
	isPlayer: boolean,
) {
	clock.triggerEvent({
		type: "startEarningMana",
		isPlayer,
	});
}

export function triggerConsumeMana(
	clock: ClockReturn<EventType>,
	isPlayer: boolean,
	amount: number,
) {
	clock.triggerEvent({
		type: "manaConsume",
		isPlayer,
		delta: amount,
	});
}

export function triggerIncreaseMana(
	clock: ClockReturn<EventType>,
	isPlayer: boolean,
	amount: number
) {
	clock.triggerEvent({
		type: "manaIncrease",
		isPlayer,
		value: amount,
	});
}

export function triggerDamageToPlayer(
	clock: ClockReturn<EventType>,
	isPlayer: boolean,
	amount: number
) {
	clock.triggerEvent({
		type: "playerDamageResolve",
		initiator: {
			type: "playerDamage",
			isPlayer,
			damage: amount,
			initiator: {
				type: "cardAttacking",
				isPlayer,
				cardPosition: -1,
				instanceId: -1,
				cardIniator: {} as InGameCardType, // may need fixes later
			}
		}
	});
}

export function attackAnimation(clock: ClockReturn<EventType>) {
	for (let i = 0; i < DAMAGE_SPEED; i++) {
		clock.nextTick();
	}
}

export function findStateByType(
	state: GameStateObject,
	isPlayerCard: boolean,
	cardPosition: number,
	type: CardState["type"],
) {
	return state.getCard(isPlayerCard, cardPosition)!.states.find(s => s.type === type)
}

export function getInstanceId(state: GameStateObject, isPlayer: boolean, cardPosition: number) {
	return state.getCard(isPlayer, cardPosition)!.instanceId;
}
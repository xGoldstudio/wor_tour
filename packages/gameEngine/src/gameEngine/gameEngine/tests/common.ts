import { GameStateObject, GameStateObjectConstructor } from "../gameState";
import _ from "lodash";
import { EventType, InGameCardType, PlaceCardType } from "../../../types/eventType";
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

export function initTest({ gameData, sideEffectOnEvent, skipStartGame, log }: {
	gameData?: Partial<GameStateObjectConstructor>,
	sideEffectOnEvent?: ({ state, clock, event }: {
		state: GameStateObject;
		clock: ClockReturn<EventType>;
		event: EventType;
	}) => void,
	skipStartGame?: boolean,
	log?: boolean
}) {
	const state = new GameStateObject({
		playerDeck: gameData?.playerDeck ?? deck,
		opponentDeck: gameData?.opponentDeck ?? deck,
		playerHp: gameData?.playerHp ?? 200,
		opponentHp: gameData?.opponentHp ?? 200,
	});
	const clock = Clock<EventType>(
		(event, clock) => {
			log && console.log(clock.getImmutableInternalState().currentFrame, event);
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
	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: isPlayer, position: position, cardInHandPosition: 0 });
}

export function triggerPlaceCard(clock: ClockReturn<EventType>, isPlayer: boolean, position: number, card: PlaceCardType) {
	clock.triggerEvent({ type: "placeCard", isPlayer: isPlayer, position: position, card, isSpecialPlacement: false });
}

export const dummyStateTest: CardState = { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" };

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

export const cloneStateTest: CardState = {
	type: "clone",
	value: 2,
	trigger: "onDeath",
	target: "selfCard",
};

export const rageStateTest: CardState = {
	type: "rage",
	value: 50,
	trigger: "idle",
	target: "selfCard",
};

export const bannerOfComandStateTest: CardState = {
	type: "bannerOfComand",
	value: 50,
	trigger: "onPlacement",
	target: "allyCards",
};

export const rushStateTest: CardState = {
	type: "rush",
	value: null,
	trigger: "onPlacement",
	target: "allyCards",
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
		instanceId: state.getCard(isPlayer, cardPosition)!.instanceId,
		cardIniator: state.getCard(isPlayer, cardPosition)!,
	});
	if (doAnimation) {
		attackAnimation(clock);
	}
}

export function triggerHealCard(
	clock: ClockReturn<EventType>,
	instanceId: number,
	amount: number,
) {
	clock.triggerEvent({
		type: "healCard",
		amount,
		instanceId: instanceId,
		cardInitiatorInstanceId: instanceId,
	})
}

export function triggerDirectAttackResolved(
	clock: ClockReturn<EventType>,
	state: GameStateObject,
	attackerInstanceId: number,
	targetInstanceId: number,
	damage: number,
	notDirect?: true,
) {
	clock.triggerEvent({
		type: "beforeCardDamageResolve",
		initiator: {
			type: "cardDamage",
			instanceId: targetInstanceId,
			directAttack: !notDirect,
			amount: damage,
			initiator: {
				type: "cardAttacking",
				instanceId: attackerInstanceId,
				cardIniator: state.getCardByInstance(attackerInstanceId)!,
			},
			cardInitiator: state.getCardByInstance(targetInstanceId)!,
			onDirectHitStates: [],
		}
	});
}

export function triggerKillCard(
	clock: ClockReturn<EventType>,
	instanceId: number,
) {
	clock.triggerEvent({
		type: "beforeCardDestroyed",
		instanceId: instanceId,
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

export function triggerChangeAttackSpeed(clock: ClockReturn<EventType>, instanceId: number, percentage: number) {
	clock.triggerEvent({ type: "changeAttackSpeed", instanceId, changePercent: percentage });
}
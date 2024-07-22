import { EventType } from "../../../types/eventType";
import { attackAnimation, defaultTestDamage, defaultTestHp, drawPlaceCard, getInstanceId, initTest, multiAttackState, triggerDirectAttack } from "./common";
import { expect, test } from 'vitest';

test("multi attack", () => {
	const { clock, state } = initTest({});
	drawPlaceCard(clock, true, 1);
	drawPlaceCard(clock, false, 0);
	drawPlaceCard(clock, false, 2);
	clock.nextTick();
	clock.triggerEvent({ type: "addState", instanceId: getInstanceId(state, true, 1), isPlayerCard: true, position: 1, state: multiAttackState });
	clock.nextTick();
	expect(state.getStateOfCard(true, 1, "multiAttack")).toBeDefined();
	/**
	 * Board:
	 * [x] [ ] [x]
	 * [ ] [x] [ ]	(player)
	 */
	triggerDirectAttack(clock, state, true, 1);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(defaultTestHp);
	expect(state.opponentBoard[2]?.hp).toBe(defaultTestHp);

	attackAnimation(clock);

	let lastTickEvents = clock.getLastTickEvents();
	const attacker = state.getCard(true, 1)!.instanceId;
	expect(findEnnemyCardDamageResolve(lastTickEvents, 0, attacker, false)).toBeDefined();
	expect(findEnnemyCardDamageResolve(lastTickEvents, 1, attacker, false)).toBeUndefined();
	expect(findEnnemyCardDamageResolve(lastTickEvents, 2, attacker, false)).toBeDefined();
	expect(findDirectDamage(lastTickEvents, false, attacker)).toBeDefined();
	expect(state.opponentBoard[0]?.hp).toBe(defaultTestHp - defaultTestDamage); // took damage from side effect
	expect(state.opponentBoard[2]?.hp).toBe(defaultTestHp - defaultTestDamage); // took damage from side effect

	drawPlaceCard(clock, false, 1);
	triggerDirectAttack(clock, state, true, 1);
	clock.nextTick();
	/**
 * Board:
 * [x] [x] [x]
 * [ ] [x] [ ]	(player)
 */
	attackAnimation(clock);
	lastTickEvents = clock.getLastTickEvents();
	expect(findEnnemyCardDamageResolve(lastTickEvents, 0, attacker, false)).toBeDefined();
	expect(findEnnemyCardDamageResolve(lastTickEvents, 1, attacker, true)).toBeDefined();
	expect(findEnnemyCardDamageResolve(lastTickEvents, 2, attacker, false)).toBeDefined();
});

function findEnnemyCardDamageResolve(history: EventType[], cardPosition: number, instanceId: number, directAttack: boolean) {
	return history.find(e =>
		e.type === "cardDamageResolve"
		&& e.initiator.amount === defaultTestDamage
		&& e.initiator.cardPosition === cardPosition
		&& e.initiator.isPlayerCard === false
		&& e.initiator.directAttack === directAttack
		&& e.initiator.initiator.instanceId === instanceId
	);
}
function findDirectDamage(history: EventType[], isPlayer: boolean, instanceId: number) {
	return history.find(e =>
		e.type === "playerDamageResolve"
		&& e.initiator.damage === defaultTestDamage
		&& e.initiator.isPlayer === isPlayer
		&& e.initiator.initiator.instanceId === instanceId
	);
}
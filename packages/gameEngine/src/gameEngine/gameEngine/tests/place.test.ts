import Clock from "../../clock/clock";
import { EventType } from "../../../types/eventType";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject, MIN_ATTACK_SPEED } from "../gameState";
import _ from "lodash";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { baseCard, drawPlaceCard, initTest } from "./common";

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, name: String(i), dmg: i, rarity: "common"}));

test("complete placement player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	state.playerMana = 9;
	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);

	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: true, instanceId: state.getHandCardInstanceId(0, true)!, position: 0 });
	clock.nextTick();
	// card should be replaced
	expect(state.playerHand[0]?.name).toEqual(deck[4].name);

	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: true, position: 0, instanceId: state.getHandCardInstanceId(0, true)! });
	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: true, position: 0, instanceId: state.getHandCardInstanceId(0, true)! });
	clock.nextTick();
	expect(state.playerBoard[0]?.dmg).toEqual(4);

	expect(state.playerMana).toEqual(6);
});

test("complete placement opponent", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	state.opponentMana = 9;
	clock.triggerEvent({ type: "drawCard", isPlayer: false, position: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, position: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, position: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, position: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);

	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: false, position: 0, instanceId: state.getHandCardInstanceId(0, false)! });
	clock.nextTick();
	// card should be replaced
	expect(state.opponentHand[0]?.name).toEqual(deck[4].name);
	expect(state.opponentBoard[0]?.dmg).toEqual(0);

	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: false, position: 0, instanceId: state.getHandCardInstanceId(0, false)! });
	clock.triggerEvent({ type: "normalPlaceCard", isPlayer: false, position: 0, instanceId: state.getHandCardInstanceId(0, false)! });
	clock.nextTick();
	expect(state.opponentBoard[0]?.dmg).toEqual(4);

	expect(state.opponentMana).toEqual(6);
});

test("place card on another card", () => {
	const { state, clock } = initTest({ skipStartGame: true });

	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	const prevInstanceId = state.playerBoard[0]?.instanceId;
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.playerBoard[0]?.instanceId).not.toEqual(prevInstanceId);
	expect(clock.getLastTickEvents().find((e) => e.type === "beforeCardDestroyed")?.instanceId).toEqual(prevInstanceId);
	clock.nextTick();
});

test("place card attack limit", () => {
	const { state, clock } = initTest({
		skipStartGame: true, gameData: { playerDeck: [{ ...baseCard, attackSpeed: 0 }, { ...baseCard, attackSpeed: 999 }] }
	});

	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getCard(true, 0)?.attackSpeed).toEqual(MIN_ATTACK_SPEED);
	drawPlaceCard(clock, true, 0, state);
	clock.nextTick();
	expect(state.getCard(true, 0)?.attackSpeed).toEqual(MIN_ATTACK_SPEED);
});
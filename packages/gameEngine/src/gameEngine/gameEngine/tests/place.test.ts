import Clock from "../../clock/clock";
import { EventType } from "../../../types/eventType";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import _ from "lodash";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { drawPlaceCard, initTest } from "./common";

const baseCard = {
  name: "string",
  cost: 1,
  illustration: "string",
  worldIllustration: "string",
  dmg: 100,
  hp: 200,
  attackSpeed: 1,
  states: [],
  level: 1,
  world: 1,
}

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, name: String(i), dmg: i, rarity: "common"}));

test("complete placement player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	state.playerMana = 9;
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
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
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
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
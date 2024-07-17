import Clock from "../../clock/clock";
import { EventType } from "../../useGameEvents";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import { CardType } from "@repo/ui";
import _ from "lodash";
import { expect, test } from 'vitest';

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

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common"}));

test("complete draw player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.playerDeck.length).toEqual(8);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(7);
	expect(state.playerHand[0]).toEqual(deck[0]);
	expect(state.playerHand[1]).toEqual(null);
	clock.nextTick();

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[1]).toEqual(deck[1]);
	expect(state.playerHand[2]).toEqual(deck[2]);
	expect(state.playerHand[3]).toEqual(deck[3]);

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[0]).toEqual(deck[4]);
	expect(state.playerHand[1]).toEqual(deck[5]);
	expect(state.playerHand[2]).toEqual(deck[6]);
	expect(state.playerHand[3]).toEqual(deck[7]);

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[0]).toEqual(deck[0]);
	expect(state.playerHand[1]).toEqual(deck[1]);
	expect(state.playerHand[2]).toEqual(deck[2]);
	expect(state.playerHand[3]).toEqual(deck[3]);
});

test("complete draw opponent", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.opponentDeck.length).toEqual(8);
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(7);
	expect(state.opponentHand[0]).toEqual(deck[0]);
	expect(state.opponentHand[1]).toEqual(null);

	clock.nextTick();

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[1]).toEqual(deck[1]);
	expect(state.opponentHand[2]).toEqual(deck[2]);
	expect(state.opponentHand[3]).toEqual(deck[3]);

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[0]).toEqual(deck[4]);
	expect(state.opponentHand[1]).toEqual(deck[5]);
	expect(state.opponentHand[2]).toEqual(deck[6]);
	expect(state.opponentHand[3]).toEqual(deck[7]);

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[0]).toEqual(deck[0]);
	expect(state.opponentHand[1]).toEqual(deck[1]);
	expect(state.opponentHand[2]).toEqual(deck[2]);
	expect(state.opponentHand[3]).toEqual(deck[3]);
});

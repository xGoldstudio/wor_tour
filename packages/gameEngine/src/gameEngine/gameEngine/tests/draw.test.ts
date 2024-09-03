import Clock from "../../clock/clock";
import { EventType } from "../../../types/eventType";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import _ from "lodash";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";

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

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, name: String(i), id: i, rarity: "common"}));

test("complete draw player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	expect(state.playerDeck.length).toEqual(8);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(7);
	expect(state.playerHand[0]?.name).toEqual(deck[0].name);
	expect(state.playerHand[1]).toEqual(null);
	clock.nextTick();

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[1]?.name).toEqual(deck[1].name);
	expect(state.playerHand[2]?.name).toEqual(deck[2].name);
	expect(state.playerHand[3]?.name).toEqual(deck[3].name);

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[0]?.name).toEqual(deck[4].name);
	expect(state.playerHand[1]?.name).toEqual(deck[5].name);
	expect(state.playerHand[2]?.name).toEqual(deck[6].name);
	expect(state.playerHand[3]?.name).toEqual(deck[7].name);

	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);
	expect(state.playerHand[0]?.name).toEqual(deck[0].name);
	expect(state.playerHand[1]?.name).toEqual(deck[1].name);
	expect(state.playerHand[2]?.name).toEqual(deck[2].name);
	expect(state.playerHand[3]?.name).toEqual(deck[3].name);
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
	expect(state.opponentHand[0]?.name).toEqual(deck[0].name);
	expect(state.opponentHand[1]).toEqual(null);

	clock.nextTick();

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[1]?.name).toEqual(deck[1].name);
	expect(state.opponentHand[2]?.name).toEqual(deck[2].name);
	expect(state.opponentHand[3]?.name).toEqual(deck[3].name);

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[0]?.name).toEqual(deck[4].name);
	expect(state.opponentHand[1]?.name).toEqual(deck[5].name);
	expect(state.opponentHand[2]?.name).toEqual(deck[6].name);
	expect(state.opponentHand[3]?.name).toEqual(deck[7].name);

	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);
	expect(state.opponentHand[0]?.name).toEqual(deck[0].name);
	expect(state.opponentHand[1]?.name).toEqual(deck[1].name);
	expect(state.opponentHand[2]?.name).toEqual(deck[2].name);
	expect(state.opponentHand[3]?.name).toEqual(deck[3].name);
});

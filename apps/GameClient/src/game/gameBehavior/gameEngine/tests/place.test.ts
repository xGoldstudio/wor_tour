import Clock from "../../clock/clock";
import { EventType } from "../../useGameEvents";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import { CardType } from "@repo/ui";
import _ from "lodash";

const baseCard = {
  name: "string",
  cost: 1,
  illustration: "string",
  worldIllustration: "string",
  dmg: 100,
  hp: 200,
  attackSpeed: 1,
  effects: {},
  level: 1,
  world: 1,
}

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common"}));

test("complete placement player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	state.playerMana = 9;
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 3 });
	clock.nextTick();
	expect(state.playerDeck.length).toEqual(4);

	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// card should be replaced
	expect(state.playerHand[0]).toEqual(deck[4]);
	expect(state.playerBoard[0]?.id).toEqual(0);

	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.playerBoard[0]?.id).toEqual(5);

	expect(state.playerMana).toEqual(6);
});

test("complete placement opponent", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	state.opponentMana = 9;
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 1 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 2 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 3 });
	clock.nextTick();
	expect(state.opponentDeck.length).toEqual(4);

	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// card should be replaced
	expect(state.opponentHand[0]).toEqual(deck[4]);
	expect(state.opponentBoard[0]?.id).toEqual(0);

	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.opponentBoard[0]?.id).toEqual(5);

	expect(state.opponentMana).toEqual(6);
});
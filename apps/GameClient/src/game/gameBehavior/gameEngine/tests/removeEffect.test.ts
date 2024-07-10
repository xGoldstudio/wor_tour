import { CardType } from "@repo/ui";
import _ from "lodash";
import { GameStateObject } from "../gameState";
import { EventType } from "../../useGameEvents";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";

const baseCard = {
	name: "string",
	cost: 1,
	illustration: "string",
	worldIllustration: "string",
	dmg: 100,
	hp: 200,
	attackSpeed: 1,
	level: 1,
	world: 1,
}

const deck: CardType[] = _.times(8, (i) => ({
	...baseCard, id: i, rarity: "common", effects: {
		multiAttack: {
			type: "multiAttack",
			amount: null,
		},
		fightBack: {
			type: "fightBack",
			amount: null,
		},
	},
}));

test("removing effect player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.playerBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.playerBoard[0]?.effects.fightBack).toBeDefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: true,
		cardPosition: 0,
		effectToRemove: "fightBack",
	});
	clock.nextTick();
	expect(state.playerBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.playerBoard[0]?.effects.fightBack).toBeUndefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: true,
		cardPosition: 1,
		effectToRemove: "multiAttack",
	});
	clock.nextTick();
	expect(state.playerBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.playerBoard[0]?.effects.fightBack).toBeUndefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: true,
		cardPosition: 0,
		effectToRemove: "multiAttack",
	});
	clock.nextTick();
	expect(state.playerBoard[0]?.effects.multiAttack).toBeUndefined();
	expect(state.playerBoard[0]?.effects.fightBack).toBeUndefined();
});

test("removing effect opponent card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.opponentBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.opponentBoard[0]?.effects.fightBack).toBeDefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: false,
		cardPosition: 0,
		effectToRemove: "fightBack",
	});
	clock.nextTick();
	expect(state.opponentBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.opponentBoard[0]?.effects.fightBack).toBeUndefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: false,
		cardPosition: 1,
		effectToRemove: "multiAttack",
	});
	clock.nextTick();
	expect(state.opponentBoard[0]?.effects.multiAttack).toBeDefined();
	expect(state.opponentBoard[0]?.effects.fightBack).toBeUndefined();
	clock.triggerEvent({
		type: "removeEffect",
		isPlayerCard: false,
		cardPosition: 0,
		effectToRemove: "multiAttack",
	});
	clock.nextTick();
	expect(state.opponentBoard[0]?.effects.multiAttack).toBeUndefined();
	expect(state.opponentBoard[0]?.effects.fightBack).toBeUndefined();
});
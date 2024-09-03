import { EventType } from "../../../types/eventType";
import { defaultTestHp, drawPlaceCard, healStateDefaultTest, initTest } from "./common";
import { describe, expect, test } from 'vitest';

describe("heal state", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	drawPlaceCard(clock, true, 1, state);
	clock.nextTick();
	const reduceHpTo = defaultTestHp - healStateDefaultTest.value!
	state.getCard(true, 0)!.hp = reduceHpTo;
	state.getCard(true, 1)!.hp = reduceHpTo;
	state.playerDeck[0].states = [healStateDefaultTest]
	drawPlaceCard(clock, true, 2, state);
	expect(state.playerBoard[0]?.hp).toBe(reduceHpTo);
	expect(state.playerBoard[1]?.hp).toBe(reduceHpTo);
	clock.nextTick();

	test("player cards should be healed by amount", () => {
		expect(state.playerBoard[0]?.hp).toBe(defaultTestHp);
		expect(state.playerBoard[1]?.hp).toBe(defaultTestHp);
	});

	test("should not heal full life cards", () => {
		expect(amountOfCardsHealed(clock.getLastTickEvents())).toBe(2);
	});

	test("expect effect to be gone", () => {
		expect(state.playerDeck[0].states.length).toBe(0);
	});

	test("should not heal full life cards", () => {
		state.getCard(true, 0)!.hp = reduceHpTo;
		state.playerDeck[0].states = [healStateDefaultTest]
		expect(state.playerBoard[0]?.hp).toBe(reduceHpTo);
		clock.nextTick();
		drawPlaceCard(clock, true, 1, state);
		clock.nextTick();

		expect(state.playerBoard[0]?.hp).toBe(defaultTestHp);
		expect(state.playerBoard[2]?.hp).toBe(defaultTestHp);
		expect(amountOfCardsHealed(clock.getLastTickEvents())).toBe(1);
	})
});

function amountOfCardsHealed(history: EventType[]) {
	return history.filter(e => e.type === "healCard").length;
}

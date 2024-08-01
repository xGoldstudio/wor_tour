import { describe, expect, test } from "vitest";
import cardForTest from "./cardsForTest";
import buildDeck, { getDeckStrength } from "./buildDeck";
import { NUMBER_OF_CARD_IN_DECK } from "@/const";

describe("base state", () => {
	let lowestStrengthDeck = 0;
	for (let i =  0; i < NUMBER_OF_CARD_IN_DECK; i++) {
		lowestStrengthDeck += cardForTest[i][0];
	}
	let highestStrengthDeck = 0;
	for (let i = 0; i < 8; i++) {
		highestStrengthDeck += cardForTest[cardForTest.length - i - 1][0];
	}
	const values: number[] = [lowestStrengthDeck];
	let i = lowestStrengthDeck;
	const delta = 0.3;
	while (i <= highestStrengthDeck) {
		i += delta;
		values.push(Math.min(i, highestStrengthDeck));
	}
	test.each(values)("buildDeck(%f, cardForTest)", (targetStr) => {
		const deck = buildDeck(targetStr, delta, cardForTest);
		expect(deck.length).toBe(NUMBER_OF_CARD_IN_DECK);
		const str = getDeckStrength(deck);
		expect(str).toBeLessThanOrEqual(targetStr);
		expect(str).toBeGreaterThanOrEqual(targetStr - delta);
		// not two times the same id
		const ids = deck.map(card => card.id);
		expect(ids.length).toBe(new Set(ids).size);
	});
});
import { CardRarity, CardType } from "@repo/lib";
import _ from "lodash";
import { getRandomCardFromRarity } from "./getRandomCardFromRarity";
import { expect, test, vi } from 'vitest';

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
	isPvp: false,
}

const commons: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i, rarity: "common", states: [],
}));

const rares: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 1, rarity: "rare", states: [],
}));

const epics: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 2, rarity: "epic", states: [],
}));

const legendaries: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 3, rarity: "legendary", states: [],
}));

const cards = [...commons, ...rares, ...epics, ...legendaries];

const rarities:Record<CardRarity, number> = {
	common: 50,
	rare: 35,
	epic: 10,
	legendary: 5,
};

test("get random card from rarity", () => {
	vi.spyOn(global.Math, 'random').mockReturnValue(0.99999);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(legendaries[0]);
	vi.spyOn(global.Math, 'random').mockReturnValue(0.9);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(epics[0]);
	vi.spyOn(global.Math, 'random').mockReturnValue(0.6);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(rares[0]);
	vi.spyOn(global.Math, 'random').mockReturnValue(0.4);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(commons[0]);

	expect(getRandomCardFromRarity(commons, rarities)).toBe(commons[0]);

	vi.spyOn(global.Math, 'random').mockReturnValue(0.55);
	expect(getRandomCardFromRarity([...commons, ...epics, ...legendaries], rarities)).toBe(commons[0]);
});

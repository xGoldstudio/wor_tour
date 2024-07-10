import { CardType } from "@repo/ui";
import _ from "lodash";
import { CardRarity } from "@repo/types";
import { getRandomCardFromRarity } from "./getRandomCardFromRarity";

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

const commons: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i, rarity: "common", effects: {},
}));

const rares: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 1, rarity: "rare", effects: {},
}));

const epics: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 2, rarity: "epic", effects: {},
}));

const legendaries: CardType[] = _.times(1, (i) => ({
	...baseCard, id: i + 3, rarity: "legendary", effects: {},
}));

const cards = [...commons, ...rares, ...epics, ...legendaries];

const rarities:Record<CardRarity, number> = {
	common: 50,
	rare: 35,
	epic: 10,
	legendary: 5,
};

test("trigger event futur tick", () => {
	jest.spyOn(global.Math, 'random').mockReturnValue(0.99999);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(legendaries[0]);
	jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(epics[0]);
	jest.spyOn(global.Math, 'random').mockReturnValue(0.6);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(rares[0]);
	jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
	expect(getRandomCardFromRarity(cards, rarities)).toBe(commons[0]);

	expect(getRandomCardFromRarity(commons, rarities)).toBe(commons[0]);

	jest.spyOn(global.Math, 'random').mockReturnValue(0.55);
	expect(getRandomCardFromRarity([...commons, ...epics, ...legendaries], rarities)).toBe(commons[0]);
});

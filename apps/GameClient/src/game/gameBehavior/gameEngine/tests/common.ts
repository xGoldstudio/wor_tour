import { CardType } from "@repo/ui";
import { GameStateObject } from "../gameState";
import _ from "lodash";
import { EventType } from "../../useGameEvents";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";

export const baseCard = {
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

export const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

export function initTest() {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 200, opponentHp: 200 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	return { state, clock };
}
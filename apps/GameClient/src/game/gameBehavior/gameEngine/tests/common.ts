import { CardType } from "@repo/ui";
import { GameStateObject } from "../gameState";
import _ from "lodash";
import { EventType } from "../../useGameEvents";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";

export const baseCard: CardType = {
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
	rarity: "common",
	id: 0,
}

export const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

export function initTest(playerDeck?: CardType[]) {
	const state = new GameStateObject({ playerDeck: playerDeck ?? deck, opponentDeck: deck, playerHp: 200, opponentHp: 200 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	return { state, clock };
}
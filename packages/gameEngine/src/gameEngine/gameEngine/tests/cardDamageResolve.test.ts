import _ from "lodash";
import { GameStateObject } from "../gameState";
import { EventType } from "../../../types/eventType";
import Clock from "../../clock/clock";
import { computeNextFrameState } from "../gameEngine";
import { expect, test } from 'vitest';
import { CardType } from "../../../types/Card";
import { getInstanceId } from "./common";

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
	...baseCard, id: i, rarity: "common", states: [],
}));

test("damage and kill player card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, position: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// deal damage to card
	function dealDamage(amount: number) {
		clock.triggerEvent({
			type: "cardDamageResolve", initiator: {
				type: "cardDamage",
				instanceId: getInstanceId(state, true, 0),
				isPlayerCard: true,
				cardPosition: 0,
				directAttack: false,
				amount: amount,
				initiator: {
					type: "cardAttacking",
					instanceId: -1,
					isPlayer: false,
					cardPosition: 0,
				},
			}
		});
	}
	dealDamage(100);
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(100);
	// now kill the card
	dealDamage(100);
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});


test("damage and kill opponent card", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);
	clock.triggerEvent({ type: "startGame" });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, position: 0, cardInHandPosition: 0 });
	clock.nextTick();
	// deal damage to card
	function dealDamage(amount: number) {
		clock.triggerEvent({
			type: "cardDamageResolve", initiator: {
				type: "cardDamage",
				instanceId: getInstanceId(state, false, 0),
				isPlayerCard: false,
				cardPosition: 0,
				directAttack: false,
				amount: amount,
				initiator: {
					type: "cardAttacking",
					instanceId: -1,
					isPlayer: true,
					cardPosition: 0,
				},
			}
		});
	}
	dealDamage(100);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(100);
	// now kill the card
	dealDamage(100);
	clock.nextTick();
	expect(state.opponentBoard[0]).toBe(null);
});
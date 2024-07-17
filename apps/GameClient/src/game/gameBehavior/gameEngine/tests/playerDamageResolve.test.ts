import _ from "lodash";
import Clock from "../../clock/clock";
import { EventType } from "../../useGameEvents";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import { CardType } from "@repo/ui";
import { expect, test } from 'vitest';

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

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common"}));

test("damage to player", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 200, opponentHp: 200});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);

	// deal damage to player
	function dealDamageToPlayer(amount: number) {
		clock.triggerEvent({ type: "playerDamageResolve", initiator: {
			type: "playerDamage",
			isPlayer: true,
			damage: amount,
			initiator: {
				type: "cardAttacking",
				isPlayer: false,
				cardPosition: 1,
				instanceId: 1,
			}
		} });
	}
	dealDamageToPlayer(10);
	clock.nextTick();
	expect(state.playerHp).toBe(190);
	expect(state.opponentHp).toBe(200);
	dealDamageToPlayer(10);
	dealDamageToPlayer(10);
	clock.nextTick();
	expect(state.playerHp).toBe(170);

	dealDamageToPlayer(200);
	clock.nextTick();
	expect(state.playerHp).toBe(-30); // damage overflow allowed
	expect(state.currentWinner).toBe("opponent");
});

test("damage to opponent", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 200, opponentHp: 200});
  const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);

	// deal damage to player
	function dealDamageToPlayer(amount: number) {
		clock.triggerEvent({ type: "playerDamageResolve", initiator: {
			type: "playerDamage",
			isPlayer: false,
			damage: amount,
			initiator: {
				type: "cardAttacking",
				isPlayer: true,
				cardPosition: 1,
				instanceId: 1,
			}
		} });
	}
	dealDamageToPlayer(10);
	clock.nextTick();
	expect(state.playerHp).toBe(200);
	expect(state.opponentHp).toBe(190);
	dealDamageToPlayer(10);
	dealDamageToPlayer(10);
	clock.nextTick();
	expect(state.opponentHp).toBe(170);

	dealDamageToPlayer(200);
	clock.nextTick();
	expect(state.opponentHp).toBe(-30); // damage overflow allowed
	expect(state.currentWinner).toBe("player");
});
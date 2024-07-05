import _ from "lodash";
import Clock from "../../clock/clock";
import { EventType } from "../../useGameEvents";
import { computeNextFrameState } from "../gameEngine";
import { GameStateObject } from "../gameState";
import { CardType } from "@repo/ui";
import { DAMAGE_SPEED } from "../events/cardDamage";

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

const deck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

test("start damage to player (animation placeholder)", () => {
	const state = new GameStateObject({ playerDeck: deck, opponentDeck: deck, playerHp: 100, opponentHp: 100 });
	const clock = Clock<EventType>(
		(event, clock) => computeNextFrameState(state, event, clock)
	);

	// deal damage to player
	function dealDamageToPlayer(amount: number) {
		clock.triggerEvent({
			type: "playerDamage",
			isPlayer: true,
			damage: amount,
			initiator: {
				type: "cardAttacking",
				isPlayer: false,
				cardPosition: 1,
				instanceId: 1,
			}
		});
	}
	dealDamageToPlayer(10);
	clock.nextTick();
	expect(state.playerHp).toBe(100);
	for (let i = 0; i < DAMAGE_SPEED - 1; i++) {
		clock.nextTick();
	}
	expect(state.playerHp).toBe(100);
	clock.nextTick();
	expect(state.playerHp).toBe(90);
});
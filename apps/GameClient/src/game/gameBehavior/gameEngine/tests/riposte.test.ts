import { CardType } from "@repo/ui";
import { baseCard, initTest } from "./common";
import * as _ from "lodash";
import { expect, test } from 'vitest';
import { DAMAGE_SPEED } from "../events/cardDamage";

const usingDeck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

usingDeck[0].states.push({
	type: "riposte",
	value: 2,
	trigger: "onDirectlyAttacked",
	target: "directEnnemyCard",
});

test("start damage to card (animation placeholder)", () => {
	const { clock, state } = initTest(usingDeck);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.getCard(true, 0)?.states[0].type).toBe("riposte");
	// player card attack opponent card
	clock.triggerEvent({
		type: "cardDamageResolve",
		initiator: {
			type: "cardDamage",
			isPlayerCard: true,
			cardPosition: 0,
			directAttack: true,
			amount: 100,
			initiator: {
				isPlayerCard: false,
				cardPosition: 0,
			},
		},
	});
	expect(state.playerBoard[0]?.hp).toBe(200);
	expect(state.opponentBoard[0]?.hp).toBe(200); 
	clock.nextTick();
	expect(state.playerBoard[0]?.hp).toBe(100);
	expect(state.getCard(true, 0)?.states[0].value).toBe(1); // riposte should have decreased
	for (let i = 0; i < DAMAGE_SPEED - 1; i++) {
		clock.nextTick();
	}
	expect(state.opponentBoard[0]?.hp).toBe(200);
	clock.nextTick();
	expect(state.opponentBoard[0]?.hp).toBe(100); // riposte attack ended
});

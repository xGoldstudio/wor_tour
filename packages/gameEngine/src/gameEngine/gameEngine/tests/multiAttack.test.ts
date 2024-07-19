import { CardType } from "@repo/lib";
import { baseCard, initTest } from "./common";
import * as _ from "lodash";
import { test } from 'vitest';

const usingDeck: CardType[] = _.times(8, (i) => ({ ...baseCard, id: i, rarity: "common" }));

usingDeck[0].states.push({
	type: "multiAttack",
	value: null,
	trigger: "onAttack",
	target: "otherEnnemyCards",
});


test("multi attack", () => {
	const { clock } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });

	// case 1 normal attack

	// case 2 direct attack with ennemy not on same case

	// case 3 direct attack with ennemy on same case and no ennemy on the other case ( no direct damage )

	// case 4 direct attack with ennemy on same case and ennemy one other case

	// case 5 direct attack with ennemy on same case and ennemies on all other cases
});
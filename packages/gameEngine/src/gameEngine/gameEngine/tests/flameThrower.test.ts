import { expect, test } from "vitest";
import { attackAnimation, baseCard, flameThrowerTest, initTest, triggerDirectAttack, triggerPlaceCard } from "./common";
import { placeCardFromCardType } from "../events/normalPlaceCard";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
test("flame Thrower", () => {
	const { clock, state } = initTest({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType({ ...baseCard, states: [flameThrowerTest] }));
	triggerPlaceCard(clock, false, 0, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, false, 1, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, false, 2, placeCardFromCardType(baseCard));
	clock.nextTick();

	triggerDirectAttack(clock, state, true, 0);
	attackAnimation(clock);
	clock.nextTick();

	expect(state.getStateOfCard(false, 0, "scorch")?.value).toBe(flameThrowerTest.value);
	expect(state.getStateOfCard(false, 1, "scorch")?.value).toBe(flameThrowerTest.value);
	expect(state.getStateOfCard(false, 2, "scorch")?.value).toBe(flameThrowerTest.value);
	
	expect(state.getCardByInstance(state.getCard(false, 0)!.instanceId)?.hp).toBe(baseCard.hp - flameThrowerTest.value! - baseCard.dmg);
	expect(state.getCardByInstance(state.getCard(false, 1)!.instanceId)?.hp).toBe(baseCard.hp - flameThrowerTest.value!);
	expect(state.getCardByInstance(state.getCard(false, 2)!.instanceId)?.hp).toBe(baseCard.hp - flameThrowerTest.value!);
})
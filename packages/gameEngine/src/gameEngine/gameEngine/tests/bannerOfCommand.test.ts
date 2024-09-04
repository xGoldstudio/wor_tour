import { expect, test } from "vitest";
import { bannerOfComandStateTest, baseCard, initGame, triggerPlaceCard } from "./common";
import { placeCardFromCardType } from "../events/normalPlaceCard";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
test("rage", () => {
	const { clock, state } = initGame({ skipStartGame: true });
	triggerPlaceCard(clock, true, 0, placeCardFromCardType(baseCard));
	triggerPlaceCard(clock, true, 1, placeCardFromCardType(baseCard));
	clock.nextTick();
	triggerPlaceCard(clock, true, 2, placeCardFromCardType({ ...baseCard, states: [bannerOfComandStateTest] }));
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "rage")?.value).toBe(bannerOfComandStateTest.value);
	expect(state.getStateOfCard(true, 1, "rage")?.value).toBe(bannerOfComandStateTest.value);
	expect(state.getStateOfCard(true, 2, "rage")?.value).toBe(bannerOfComandStateTest.value);
});
import { expect, test } from "vitest";
import { bannerOfComandStateTest, baseCard, drawPlaceCard, initTest } from "./common";

// pretty straight forward effect, should give rage of value to all ally cards, that's it
test("rage", () => {
	const { clock, state } = initTest({ gameData: { playerDeck: [baseCard, baseCard, baseCard] } ,skipStartGame: true });
	drawPlaceCard(clock, true, 0);
	drawPlaceCard(clock, true, 1);
	clock.nextTick();
	state.playerHand[0]!.states = [bannerOfComandStateTest]; // hijaking and card to set state
	drawPlaceCard(clock, true, 2);
	clock.nextTick();
	expect(state.getStateOfCard(true, 0, "rage")?.value).toBe(bannerOfComandStateTest.value);
	expect(state.getStateOfCard(true, 1, "rage")?.value).toBe(bannerOfComandStateTest.value);
	expect(state.getStateOfCard(true, 2, "rage")?.value).toBe(bannerOfComandStateTest.value);
})
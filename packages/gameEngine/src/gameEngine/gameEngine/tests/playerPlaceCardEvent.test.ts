import { expect, test } from "vitest";
import { baseCard, initTest } from "./common";

test("Not enough mana", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [{ ...baseCard, cost: 1 }]} });

	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 0 });
	clock.nextTick();
	clock.triggerEvent({
		type: "playerPlaceCard",
		instanceId: state.getHandCardInstanceId(0, true)!,
		position: 0,
		isPlayer: true,
	});
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});

test("Card not in hand", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [baseCard, { ...baseCard, cost: 0 }]} });

	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 0 });
	clock.nextTick();
	clock.triggerEvent({
		type: "playerPlaceCard",
		instanceId: 959955,
		position: 0,
		isPlayer: true,
	});
	clock.nextTick();
	expect(state.playerBoard[0]).toBe(null);
});

test("Ok + double placement (one invalid)", () => {
	const { clock, state } = initTest({ skipStartGame: true, gameData: { playerDeck: [{ ...baseCard, cost: 1 }, baseCard]} });

	clock.triggerEvent({ type: "drawCard", isPlayer: true, position: 0 });
	clock.triggerEvent({ type: "manaIncrease", isPlayer: true, value: 1 });
	clock.triggerEvent({ type: "manaIncrease", isPlayer: true, value: 1 });
	clock.nextTick();
	clock.triggerEvent({
		type: "playerPlaceCard",
		instanceId: state.getHandCardInstanceId(0, true)!,
		position: 0,
		isPlayer: true,
	});
	clock.triggerEvent({
		type: "playerPlaceCard",
		instanceId: state.getHandCardInstanceId(0, true)!,
		position: 1,
		isPlayer: true,
	});
	clock.nextTick();
	expect(state.playerBoard[0]).not.toBeNull();
	expect(state.playerBoard[1]).toBeNull();
});
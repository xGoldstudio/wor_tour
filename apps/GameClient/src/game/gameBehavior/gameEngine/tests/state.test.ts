import { initTest } from "./common";

test("CRUDS operations on states", () => {
	const { clock, state } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(0);

	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" } });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(1);
	expect(state.playerBoard[0]?.states[0].type).toBe("dummy");
	expect(state.playerBoard[0]?.states[0].value).toBe(2);
	expect(state.playerBoard[0]?.states[0].trigger).toBe("onAttack");
	expect(state.playerBoard[0]?.states[0].target).toBe("selfCard");

	clock.triggerEvent({ type: "modifyStateValue", isPlayerCard: true, cardPosition: 0, value: 1, state: state.playerBoard[0]!.states[0] });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(1);
	expect(state.playerBoard[0]?.states[0].value).toBe(1);

	clock.triggerEvent({ type: "removeState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[0] });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(0);

	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" } });
	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" } });
	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" } });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(3);

	clock.triggerEvent({ type: "removeState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[0] });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(2);

	clock.triggerEvent({ type: "removeState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[0] });
	clock.triggerEvent({ type: "removeState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[1] });
	clock.nextTick();
	expect(state.playerBoard[0]?.states.length).toBe(0);
});

test("Effectively trigger states", () => {
	const { clock, state } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();

	clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "onAttack", target: "selfCard" } });
	clock.triggerEvent({ type: "triggerState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[0] });
	clock.nextTick();
});
import { CardState, CardStatesData } from "@repo/ui";
import { baseCard, initTest } from "./common";
import { expect, test, vi, describe } from 'vitest';

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

describe("trigger", () => {
	const { clock, state } = initTest();
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	clock.nextTick();

	test("Effectively trigger states", () => {
		clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 2, trigger: "idle", target: "selfCard" } });
		clock.nextTick();
		clock.triggerEvent({ type: "triggerState", isPlayerCard: true, cardPosition: 0, state: state.playerBoard[0]!.states[0], initiator: { type: "dummyEvent" } });
		vi.spyOn(CardStatesData["dummy"], "action").mockImplementation((props) => {
			expect(props.trigger).toBe("idle");
			expect(props.target).toBe("selfCard");
			expect(props.value).toBe(2);
		});
		expect(CardStatesData["dummy"].action).not.toHaveBeenCalled();
		clock.nextTick();
		expect(CardStatesData["dummy"].action).toHaveBeenCalled();
	});

	test("Trigger: OnAttack", () => {
		// on attack
		vi.spyOn(CardStatesData["dummy"], "action").mockImplementation((props) => {
			expect(props.trigger).toBe("onAttack");
			expect(props.value).toBe(3);
		});
		clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: { type: "dummy", value: 3, trigger: "onAttack", target: "selfCard" } });
		clock.triggerEvent({ type: "cardAttacking", isPlayer: true, cardPosition: 0, instanceId: state.playerBoard[0]!.instanceId });
		expect(CardStatesData["dummy"].action).not.toHaveBeenCalled();
		clock.nextTick();
		expect(CardStatesData["dummy"].action).toHaveBeenCalled();
	});

	function cardPlayerAttackOpponentCard() {
		clock.triggerEvent({
			type: "cardDamageResolve", initiator: {
				type: "cardDamage",
				amount: 1,
				cardPosition: 0,
				isPlayerCard: false,
				directAttack: true,
				initiator: {
					isPlayerCard: true, // the card with effect
					cardPosition: 0,
				},
			}
		});
	}

	test("Trigger: OnDirectAttackHit", () => {
		// on direct attack hit
		clock.triggerEvent({ type: "drawCard", isPlayer: false, handPosition: 0 });
		clock.triggerEvent({ type: "placeCard", isPlayer: false, targetPosition: 0, cardInHandPosition: 0 });
		const state: CardState = { type: "dummy", value: 4, trigger: "onDirectAttackHit", target: "selfCard" };
		clock.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state: state });
		clock.nextTick();
		vi.spyOn(CardStatesData["dummy"], "action").mockImplementation((props) => {
			expect(props.trigger).toBe("onDirectAttackHit");
			expect(props.value).toBe(4);
		});
		cardPlayerAttackOpponentCard();
		expect(CardStatesData["dummy"].action).not.toHaveBeenCalled();
		clock.nextTick();
		expect(CardStatesData["dummy"].action).toHaveBeenCalled();
		clock.triggerEvent({ type: "removeState", isPlayerCard: true, cardPosition: 0, state: state });
		clock.nextTick();
	});

	test("Trigger: OnDirectlyAttacked", () => {
		const state: CardState = { type: "dummy", value: 5, trigger: "onDirectlyAttacked", target: "selfCard" };
		clock.triggerEvent({ type: "addState", isPlayerCard: false, cardPosition: 0, state });
		vi.spyOn(CardStatesData["dummy"], "action").mockImplementation((props) => {
			expect(props.trigger).toBe("onDirectlyAttacked");
			expect(props.value).toBe(5);
		});
		cardPlayerAttackOpponentCard();
		expect(CardStatesData["dummy"].action).not.toHaveBeenCalled();
		clock.nextTick();
		expect(CardStatesData["dummy"].action).toHaveBeenCalled();
		clock.triggerEvent({ type: "removeState", isPlayerCard: false, cardPosition: 0, state });
		clock.nextTick();
	});
});

test("Trigger: OnPlacement", () => {
	const card = baseCard;
	card.states = [{ type: "dummy", value: 2, trigger: "onPlacement", target: "selfCard" }];
	const { clock, state } = initTest([card]);
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });
	vi.spyOn(CardStatesData["dummy"], "action").mockImplementation((props) => {
		expect(props.trigger).toBe("onPlacement");
		expect(props.value).toBe(2);
	});
	expect(CardStatesData["dummy"].action).not.toBeCalled();
	clock.nextTick();
	expect(CardStatesData["dummy"].action).toHaveBeenCalled();
	expect(state.getCard(true, 0)?.states.length).toBe(0); // on placement effects are removed once used
});
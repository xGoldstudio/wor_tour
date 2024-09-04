import { CardStatesData, drawPlaceCard, dummyStateTest, initGame } from 'game_engine';
import { expect, test, vi } from 'vitest';

test("State lifecylce actions", () => {
	const { state, clock } = initGame({ skipStartGame: true });
	drawPlaceCard(clock, true, 0, state);
	const options = CardStatesData["dummy"].options;
	let onAddedActionSpy = vi.spyOn(options, "onAdded");
	let onRemovedActionSpy = vi.spyOn(options, "onRemoved");
	clock.nextTick();
	clock.triggerEvent({
		type: "addState",
		instanceId: state.getCard(true, 0)!.instanceId,
		state: { ...dummyStateTest },
	});
	clock.nextTick();
	expect(onAddedActionSpy).toHaveBeenCalledOnce();
	expect(onRemovedActionSpy).not.toHaveBeenCalled();
	clock.triggerEvent({
		type: "beforeRemoveState",
		instanceId: state.getCard(true, 0)!.instanceId,
		stateType: "dummy",
	});
	clock.nextTick();
	expect(onAddedActionSpy).toHaveBeenCalledOnce();
	expect(onRemovedActionSpy).toHaveBeenCalledOnce();
	// also test on stack, where the onAdded and onRemoved should be called twice

	onAddedActionSpy = vi.spyOn(options, "onAdded");
	onRemovedActionSpy = vi.spyOn(options, "onRemoved");
	const onChangeValueActionSpy = vi.spyOn(options, "onChangeValue");
	clock.triggerEvent({
		type: "addState",
		instanceId: state.getCard(true, 0)!.instanceId,
		state: { ...dummyStateTest },
	});
	clock.triggerEvent({
		type: "addState",
		instanceId: state.getCard(true, 0)!.instanceId,
		state: { ...dummyStateTest },
	});
	clock.nextTick();
	expect(onAddedActionSpy).toHaveBeenCalledOnce();
	expect(onChangeValueActionSpy).toHaveBeenCalledOnce();
	expect(onRemovedActionSpy).not.toHaveBeenCalled();
	clock.triggerEvent({
		type: "beforeRemoveState",
		instanceId: state.getCard(true, 0)!.instanceId,
		stateType: "dummy",
	});
	clock.nextTick();
	expect(onAddedActionSpy).toHaveBeenCalledOnce();
	expect(onChangeValueActionSpy).toHaveBeenCalledOnce();
	expect(onAddedActionSpy).toHaveBeenCalledOnce();
});

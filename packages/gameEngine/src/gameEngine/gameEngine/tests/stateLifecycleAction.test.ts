import { CardStatesData, drawPlaceCard, dummyStateTest, initTest } from 'game_engine';
import { expect, test, vi } from 'vitest';

test("State lifecylce actions", () => {
	const { state, clock } = initTest({ skipStartGame: true });
	drawPlaceCard(clock, true, 0);
	const options = CardStatesData["dummy"].options;
	const onAddedActionSpy = vi.spyOn(options, "onAdded");
	const onRemovedActionSpy = vi.spyOn(options, "onRemoved");
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
});

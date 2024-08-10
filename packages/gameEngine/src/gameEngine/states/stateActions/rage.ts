import { AddedStateAction, ChangeValueStateAction, RemovedStateAction } from "@repo/lib";

const onAddedRage: AddedStateAction = ({ clock, gameState, event }) => {
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, "rage");
	if (!state || state.value === null) {
		return;
	}
	clock.triggerEvent({
		type: "changeAttackSpeed",
		instanceId: event.instanceId,
		changePercent: state.value,
	});
}

const onRemovedRage: RemovedStateAction = ({ clock, gameState, event }) => {
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, "rage");
	if (!state || state.value === null) {
		return;
	}
	clock.triggerEvent({
		type: "changeAttackSpeed",
		instanceId: event.instanceId,
		changePercent: -state.value,
	});
}

const onChangeValueRage: ChangeValueStateAction = ({ clock, event }) => {
	clock.triggerEvent({
		type: "changeAttackSpeed",
		instanceId: event.instanceId,
		changePercent: event.delta,
	});
}

export {
	onAddedRage,
	onRemovedRage,
	onChangeValueRage,
};
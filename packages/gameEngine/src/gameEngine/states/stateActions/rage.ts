import { AddedStateAction, ChangeValueStateAction, RemovedStateAction } from "@repo/lib";

const onAddedRage: AddedStateAction = ({ clock, gameState, event }) => {
	const card = gameState.getCardInstance(event.instanceId);
	if (card === null) {
		return;
	}
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

const onChangeValueRage: ChangeValueStateAction = ({ clock, gameState, event }) => {
	const card = gameState.getCardInstance(event.instanceId);
	if (card === null) {
		return;
	}
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, "rage");
	if (!state || state.value === null) {
		return;
	}
	clock.triggerEvent({
		type: "changeAttackSpeed",
		instanceId: event.instanceId,
		changePercent: event.delta,
	});
}

const onRemovedRage: RemovedStateAction = ({ clock, gameState, event }) => {
	const card = gameState.getCardInstance(event.instanceId);
	if (card === null) {
		return;
	}
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

export {
	onAddedRage,
	onRemovedRage,
	onChangeValueRage,
};
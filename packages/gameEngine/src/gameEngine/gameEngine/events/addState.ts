import { AddStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { CardState, CardStateDataOptions, getOptionsFromType } from "../../states/CardStatesData";

export default function addStateEvent({ gameState, event, clock }: ComputeEventProps<AddStateEvent>) {
	const existingState = gameState.getStateOfCardByInstanceId(event.instanceId, event.state.type);
	const options = getOptionsFromType(event.state.type);
	if (options.decay !== undefined) {
		clock.triggerEvent({
			type: "startStateDecay",
			stateType: event.state.type,
			instanceId: event.instanceId,
			duration: options.decay,
		});
	}
	if (existingState) {
		const increaseBy = getStackingIncreaseBy(options, existingState, event.state.value);
		if (increaseBy !== null) {
			clock.triggerEvent({
				type: "increaseStateValue",
				stateType: event.state.type,
				increaseBy,
				instanceId: event.instanceId,
			});
		}
		return;
	} else {
		if (options.onAdded) {
			clock.triggerEvent({
				type: "stateLifecycleOnAdd",
				instanceId: event.instanceId,
				stateType: event.state.type,
				state: event.state,
			});
		}
	}
	gameState.addState(event.instanceId, event.state);
}

export function getStackingIncreaseBy(options: CardStateDataOptions, existingState: CardState, value: number | null) {
	if (options.stackable && existingState.value !== null && value !== null) {
		const previousValue = existingState.value;
		let nextValue = existingState.value;
		if (options.stackableStrategy === "sum" || options.stackableStrategy === undefined) {
			nextValue += value;
		} else if (options.stackableStrategy === "max") {
			nextValue = Math.max(existingState.value, value);
		}
		if (nextValue > previousValue) {
			return nextValue - previousValue;
		}
	}
	return null;
}
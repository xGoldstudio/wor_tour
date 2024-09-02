import { AddStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

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
		if (options.stackable && existingState.value !== null && event.state.value !== null) {
			const previousValue = existingState.value;
			let nextValue = existingState.value;
			if (options.stackableStrategy === "sum" || options.stackableStrategy === undefined) {
				nextValue += event.state.value;
			} else if (options.stackableStrategy === "max") {
				nextValue = Math.max(existingState.value, event.state.value);
			}
			if (nextValue > previousValue) {
				clock.triggerEvent({
					type: "increaseStateValue",
					stateType: event.state.type,
					increaseBy: nextValue - previousValue,
					instanceId: event.instanceId,
				});
			}
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
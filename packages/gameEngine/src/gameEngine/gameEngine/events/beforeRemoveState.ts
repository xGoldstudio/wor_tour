import { getOptionsFromType } from '../../states/CardStatesData';
import { BeforeRemoveStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function beforeRemoveStateEvent({ event, clock }: ComputeEventProps<BeforeRemoveStateEvent>) {
	const options = getOptionsFromType(event.stateType);
	if (options.onRemoved) {
		clock.triggerEvent({
			type: "stateLifecycleOnRemove",
			instanceId: event.instanceId,
			stateType: event.stateType,
		});
	}
	clock.triggerEvent({
		type: "removeState",
		instanceId: event.instanceId,
		stateType: event.stateType,
	});
}
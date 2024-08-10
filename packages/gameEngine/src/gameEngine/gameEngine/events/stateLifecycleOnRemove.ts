import { StateLifcycleOnRemoveEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

export default function stateLifecycleOnRemove({ gameState, event, clock }: ComputeEventProps<StateLifcycleOnRemoveEvent>) {
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, event.stateType);
	if (!state) {
		return;
	}
	const options = getOptionsFromType(event.stateType);
	if (!options.onRemoved) return;
	options.onRemoved({
		clock,
		gameState: gameState,
		event,
	});
}
import { StateLifcycleOnChangeValueEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

export default function stateLifecycleOnChangeValue({ gameState, event, clock }: ComputeEventProps<StateLifcycleOnChangeValueEvent>) {
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, event.stateType);
	if (!state) {
		return;
	}
	const options = getOptionsFromType(event.stateType);
	if (!options.onChangeValue) return;
	options.onChangeValue({
		clock,
		gameState: gameState,
		event,
	});
}
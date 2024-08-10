import { StateLifcycleOnAddEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

export default function stateLifecycleOnAdd({ gameState, event, clock }: ComputeEventProps<StateLifcycleOnAddEvent>) {
	const state = gameState.getStateOfCardByInstanceId(event.instanceId, event.stateType);
	if (!state) {
		return;
	}
	const options = getOptionsFromType(event.stateType);
	if (!options.onAdded) return;
	options.onAdded({
		clock,
		gameState: gameState,
		event,
	});
}
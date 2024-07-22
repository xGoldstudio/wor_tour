import { AddStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

export default function addStateEvent({ gameState, event, clock }: ComputeEventProps<AddStateEvent>) {
	const existingState = gameState.getStateOfCardByInstanceId(event.instanceId, event.state.type);
	if (existingState) {
		const options = getOptionsFromType(event.state.type);
		if (options?.stackable && existingState.value !== null && event.state.value !== null) {
			clock.triggerEvent({
				type: "increaseStateValue",
				stateType: event.state.type,
				increaseBy: event.state.value,
				instanceId: event.instanceId,
				position: event.position,
				isPlayerCard: event.isPlayerCard,
			});
		}
		return;
	}
	gameState.addState(event.instanceId, event.state);
}
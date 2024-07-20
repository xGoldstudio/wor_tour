import { AddStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";

export default function addStateEvent({ gameState, event, clock }: ComputeEventProps<AddStateEvent>) {
	const existingState = gameState.getStateOfCard(event.isPlayerCard, event.cardPosition, event.state.type);
	if (existingState) {
		const options = getOptionsFromType(event.state.type);
		if (options?.stackable && existingState.value !== null && event.state.value !== null) {
			clock.triggerEvent({
				type: "modifyStateValue",
				isPlayerCard: event.isPlayerCard,
				cardPosition: event.cardPosition,
				state: existingState,
				value: existingState.value + event.state.value,
			});
		}
		return;
	}
	gameState.addState(event.isPlayerCard, event.cardPosition, event.state);
}
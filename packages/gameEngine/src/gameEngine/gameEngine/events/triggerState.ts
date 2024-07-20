import { CardStatesData, getOptionsFromType } from "../../states/CardStatesData";
import { TriggerStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function triggerStateEvent({ gameState, event, clock }: ComputeEventProps<TriggerStateEvent>) {
	const card = gameState.getCard(event.isPlayerCard, event.cardPosition);
	if (card === null) return;
	const stateData = CardStatesData[event.state.type];
	const options = getOptionsFromType(event.state.type);
	stateData.action({
		trigger: event.state.trigger,
		target: event.state.target,
		value: event.state.value,
		clock,
		card,
		gameState: gameState,
		event,
	});
	if (event.state.trigger === "onPlacement") {
		clock.triggerEvent({
			type: "removeState",
			isPlayerCard: event.isPlayerCard,
			cardPosition: event.cardPosition,
			state: event.state,
		})
	} else if (options.consume !== undefined && event.state.value !== null) {
		const nextValue = event.state.value - options.consume;
		if (nextValue <= 0) {
			clock.triggerEvent({
				type: "removeState",
				isPlayerCard: event.isPlayerCard,
				cardPosition: event.cardPosition,
				state: event.state,
			})
		} else {
			clock.triggerEvent({
				type: "modifyStateValue",
				isPlayerCard: event.isPlayerCard,
				cardPosition: event.cardPosition,
				state: event.state,
				value: nextValue,
			})
		}
	}
}

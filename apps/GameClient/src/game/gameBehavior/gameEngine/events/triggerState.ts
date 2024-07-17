import { CardStatesData } from "@repo/ui";
import { TriggerStateEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function triggerStateEvent({ gameState, event, clock }: ComputeEventProps<TriggerStateEvent>) {
	const card = gameState.getCard(event.isPlayerCard, event.cardPosition);
	if (card === null) return;
	const stateData = CardStatesData[event.state.type];
	const options = { ...stateData.options };
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
		clock.triggerEvent({
			type: "modifyStateValue",
			isPlayerCard: event.isPlayerCard,
			cardPosition: event.cardPosition,
			state: event.state,
			value: event.state.value - options.consume,
		})
	}
}

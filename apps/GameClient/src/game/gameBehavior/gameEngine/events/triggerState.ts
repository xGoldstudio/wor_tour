import { CardStatesData } from "@repo/ui";
import { TriggerStateEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function triggerStateEvent({ gameState, event, clock }: ComputeEventProps<TriggerStateEvent>) {
	CardStatesData[event.state.type].action({
		trigger: event.state.trigger,
		target: event.state.target,
		value: event.state.value,
		clock,
		state: gameState,
		event,
	});
}
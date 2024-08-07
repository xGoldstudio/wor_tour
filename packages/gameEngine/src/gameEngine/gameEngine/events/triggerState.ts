import { CardStatesData, getOptionsFromType } from "../../states/CardStatesData";
import { TriggerStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function triggerStateEvent({ gameState, event, clock }: ComputeEventProps<TriggerStateEvent>) {
	const card = gameState.getCardInstance(event.instanceId);
	const stateData = CardStatesData[event.state.type];
	const options = getOptionsFromType(event.state.type);
	stateData.action({
		trigger: event.state.trigger,
		target: event.state.target,
		value: event.state.value,
		clock,
		gameState: gameState,
		card: event.cardInitiator,
		event,
	});
	if (card === null) return;
	if (event.state.trigger === "onPlacement") {
		clock.triggerEvent({
			type: "removeState",
			instanceId: card.instanceId,
			stateType: event.state.type,
			position: event.position,
			isPlayerCard: event.isPlayerCard,
		});
	} else if (options.consume !== undefined && event.state.value !== null) {
		const nextValue = event.state.value - options.consume;
		if (nextValue <= 0) {
			clock.triggerEvent({
				type: "removeState",
				instanceId: card.instanceId,
				stateType: event.state.type,
				position: event.position,
				isPlayerCard: event.isPlayerCard
			});
		} else {
			clock.triggerEvent({
				type: "decreaseStateValue",
				instanceId: card.instanceId,
				decreaseBy: options.consume,
				stateType: event.state.type,
				position: event.position,
				isPlayerCard: event.isPlayerCard
			});
		}
	}
}

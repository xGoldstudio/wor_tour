import { AddDeckCardStateEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { getOptionsFromType } from "../../states/CardStatesData";
import { getStackingIncreaseBy } from "./addState";

/**
 * Behaviour here is simpler than the state management of placed cards, there is no rules, state must explictetly tell what they want.
 * AddState will add or replace state, no stacking, no decay or anything else.
 */
export default function addDeckCardState({ gameState, event, clock }: ComputeEventProps<AddDeckCardStateEvent>) {
	const existingState = gameState.getStateOfDeckCardByInstaceId(event.instanceId, event.state.type);
	const options = getOptionsFromType(event.state.type);
	if (existingState) {
		const increaseBy = getStackingIncreaseBy(options, existingState, event.state.value);
		if (increaseBy !== null) {
			clock.triggerEvent({
				type: "increaseDeckCardStateValue",
				instanceId: event.instanceId,
				stateType: event.state.type,
				increaseBy,
			});
		}
		return;
	}
	gameState.updateDeckCard(event.instanceId, (card) => {
		card.states = [...card.states.filter((state) => state.type !== event.state.type), { ...event.state }];
	});
}
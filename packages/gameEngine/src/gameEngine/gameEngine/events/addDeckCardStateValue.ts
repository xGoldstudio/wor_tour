import { AddDeckCardStateValue } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

/**
 * Behaviour here is simpler than the state management of placed cards, there is no rules, state must explictetly tell what they want.
 * AddState will add or replace state, no stacking, no decay or anything else.
 */
export default function addDeckCardStateValue({ gameState, event }: ComputeEventProps<AddDeckCardStateValue>) {
	gameState.updateDeckCard(event.instanceId, (card) => {
		card.states = [...card.states.filter((state) => state.type !== state.type), event.state];
	});
}
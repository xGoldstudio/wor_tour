import { StartStateDecayEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export default function startStateDecay({ gameState, clock, event }: ComputeEventProps<StartStateDecayEvent>) {
	const currentDecay = gameState.getStateDecayTimeout(event.instanceId, event.stateType);
	if (currentDecay !== null) {
		// if state already decaying, we reset the decay
		gameState.removeStateDecayTimeout(event.instanceId, event.stateType);
		const removedEvents = clock.removeGameEventTimeout({
			type: "endStateDecay",
			instanceId: event.instanceId,
			stateType: event.stateType,
		}, currentDecay.endFrame);
		if (removedEvents !== 1) {
			console.error("Expected to remove 1 event, but removed", removedEvents);
		}
	}
	clock.setGameEventTimeout({
		type: "endStateDecay",
		instanceId: event.instanceId,
		stateType: event.stateType,
	}, event.duration);
	gameState.addStateDecayTimeout(event.instanceId, event.stateType, clock.getImmutableInternalState().currentFrame, event.duration);
}
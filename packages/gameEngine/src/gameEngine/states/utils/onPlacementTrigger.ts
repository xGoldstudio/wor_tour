import { TriggerStateEvent } from 'game_engine';

export default function onPlacementTrigger(event: TriggerStateEvent) {
	const initiator = event.initiator;
	if (initiator.type !== "afterStatePlaceCard") {
		throw new Error("Critical error: this event should not be triggered");
	}
	return initiator;
}
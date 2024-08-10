import { TriggerStateEvent } from 'game_engine';

export default function onDeathTrigger(event: TriggerStateEvent) {
	const initiator = event.initiator;
	if (initiator.type !== "beforeCardDestroyed") {
		throw new Error("Critical error: this event should not be triggered");
	}
	return initiator;
}
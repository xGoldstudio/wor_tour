import { TriggerStateEvent } from 'game_engine';

export default function onDirectAttackHit(event: TriggerStateEvent) {
	const initiator = event.initiator;
	if (initiator.type !== "cardDamageResolve") {
		throw new Error("Critical error: this event should not be triggered");
	}
	return initiator;
}
import { BeforeCardDamageResolveEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

// this event is required to have state effectively added to the card  
export default function beforeCardDamageResolve({ event, gameState, clock }: ComputeEventProps<BeforeCardDamageResolveEvent>) {
	clock.triggerEvent({
		type: "cardDamageResolve",
		initiator: event.initiator,
	});
}
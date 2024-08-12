import { AfterStatePlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

// this event is required to have state effectively added to the card  
export default function afterStatePlaceCard({ event, gameState, clock }: ComputeEventProps<AfterStatePlaceCardEvent>) {
	triggerStates({
		trigger: "onPlacement",
		clock,
		gameState,
		instanceId: event.instanceId,
		initiator: event,
	});
}
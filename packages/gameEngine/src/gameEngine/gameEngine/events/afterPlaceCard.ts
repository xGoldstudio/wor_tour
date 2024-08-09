import { AfterPlaceCardEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { triggerStates } from "./cardAttacking";

export default function afterPlaceCard({ event, gameState, clock }: ComputeEventProps<AfterPlaceCardEvent>) {
	triggerStates({
		trigger: "onPlacement",
		clock,
		gameState,
		instanceId: event.instanceId,
		initiator: event,
	});
}
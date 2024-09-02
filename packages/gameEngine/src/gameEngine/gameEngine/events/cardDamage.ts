import { CardDamageEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

export const DAMAGE_SPEED = 20;

export default function cardDamageEvent({ clock, event }: ComputeEventProps<CardDamageEvent>) {
	clock.setGameEventTimeout(
		{
			type: "beforeCardDamageResolve",
			initiator: event,
		},
		DAMAGE_SPEED
	);
}
import { CardDamageEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export const DAMAGE_SPEED = 20;

export default function cardDamageEvent({ clock, event }: ComputeEventProps<CardDamageEvent>) {
	clock.setGameEventTimeout(
		{
			type: "cardDamageResolve", initiator: event,
		},
		DAMAGE_SPEED
	);
}
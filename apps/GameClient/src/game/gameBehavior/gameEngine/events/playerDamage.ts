import { PlayerDamageEvent } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";
import { DAMAGE_SPEED } from "./cardDamage";

export default function playerDamageEvent({ event, clock }: ComputeEventProps<PlayerDamageEvent>) {
	clock.setGameEventTimeout(
		{
			type: "playerDamageResolve", initiator: event,
		},
		DAMAGE_SPEED
	);
}
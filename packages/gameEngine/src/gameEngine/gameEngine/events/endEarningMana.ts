import { EndEarningManaEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { MAX_MANA } from "../gameState";

export default function endEarningManaEvent({ event, gameState, clock }: ComputeEventProps<EndEarningManaEvent>) {
	if (
		gameState.getMana(event.isPlayer) < MAX_MANA
		&& gameState.getStartEarningMana(event.isPlayer) !== null
		&& gameState.getStartEarningMana(event.isPlayer) === event.startEarningManaFrame
	) {
		clock.triggerEvent({ type: "manaIncrease", isPlayer: event.isPlayer, value: 1 });
		clock.triggerEvent({ type: "startEarningMana", isPlayer: event.isPlayer });
	}
	gameState.resetEarningMana(event.isPlayer);
}

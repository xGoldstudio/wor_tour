import { StartEarningManaEvent } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { MAX_MANA } from "../gameState";

export default function startEarningManaEvent({ event, gameState, clock }: ComputeEventProps<StartEarningManaEvent>) {
	if (
		gameState.getMana(event.isPlayer) < MAX_MANA
		&& gameState.getStartEarningMana(event.isPlayer) === null
	) {
		const currentFrame = clock.getImmutableInternalState().currentFrame;
		gameState.startEarningMana(event.isPlayer, currentFrame);
		clock.setGameEventTimeout(
			{
				type: "endEarningMana",
				isPlayer: event.isPlayer,
				startEarningManaFrame: currentFrame,
			},
			gameState.getManaSpeed(event.isPlayer),
		);
	} else {
		gameState.resetEarningMana(event.isPlayer);
	}
}
import { StartEarningMana } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";
import { MAX_MANA } from "../gameState";

export default function startEarningManaEvent({ event, gameState, clock }: ComputeEventProps<StartEarningMana>) {
	if (
		gameState.getMana(event.isPlayer) < MAX_MANA
		&& gameState.getStartEarningMana(event.isPlayer) === null
	) {
		gameState.startEarningMana(event.isPlayer, clock.getImmutableInternalState().currentFrame);
		clock.setGameEventTimeout(
			{
				type: "manaIncrease",
				isPlayer: event.isPlayer,
				value: 1,
				isNaturalEarn: true,
			},
			gameState.getManaSpeed(event.isPlayer),
		);
	} else {
		gameState.resetEarningMana(event.isPlayer);
	}
}
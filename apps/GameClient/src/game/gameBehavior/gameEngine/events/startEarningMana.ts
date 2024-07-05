import { StartEarningMana } from "../../useGameEvents";
import { ComputeEventProps } from "../gameEngine";

export default function startEarningManaEvent({ event, gameState, clock }: ComputeEventProps<StartEarningMana>) {
	if (
		(event.isPlayer ? gameState.playerMana : gameState.opponentMana) < 9 &&
		(event.isPlayer
			? gameState.playerTickStartEarningMana
			: gameState.opponentTickStartEarningMana) === null
	) {
    gameState.startEarningMana(event.isPlayer, clock.getImmutableInternalState().currentFrame);
    clock.setGameEventTimeout(
			{
				type: "manaIncrease",
        isPlayer: event.isPlayer,
      },
      gameState[event.isPlayer ? "playerManaSpeed" : "opponentManaSpeed"]
    );
	}
}
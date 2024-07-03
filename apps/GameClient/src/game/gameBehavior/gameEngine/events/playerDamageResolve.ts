import { ComputeEventProps } from '../gameEngine';
import { PlayerDamageResolveEvent } from './../../useGameEvents';

export default function playerDamageResolveEvent({ event, gameState, clock }: ComputeEventProps<PlayerDamageResolveEvent>) {
	gameState.dealDamageToPlayer(event.initiator.isPlayer, event.initiator.damage);
	if (
		gameState.playerHp <= 0 || gameState.opponentHp <= 0
	) {
		clock.triggerEvent({
			type: "gameOver",
			winnerIsPlayer: !event.initiator.isPlayer,
		});
	}
}
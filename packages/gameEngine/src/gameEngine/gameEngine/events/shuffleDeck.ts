import { ShuffleDeckEvent } from '../../../types/eventType';
import { ComputeEventProps } from "../gameEngine";

export default function shuffleDeckEvent({ event, gameState }: ComputeEventProps<ShuffleDeckEvent>) {
	gameState.shuffleDeck(event.isPlayer);
}
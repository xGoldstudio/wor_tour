import { useGameEventListener, useOnUnMount } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import GameCanvas, { GameCanvasReturn } from "./gameCanvas";
import { CardDamageEvent, HealCardEvent, PlayerDamageEvent } from "game_engine";

export default function useGameCanvas() {
  const gameRef = useRef<null | HTMLDivElement>(null);
  const [gameCanvas] = useState<GameCanvasReturn>(() => GameCanvas());

  useEffect(() => {
    if (gameRef.current) {
      gameCanvas?.append(gameRef.current);
    }
    return () => {};
  }, [gameCanvas]);

	useOnUnMount(() => {
    gameCanvas.destroy();
	})

	useGameEventListener({
		type: "cardDamage",
		action: (e, state, __, clock) => {
			const event = e as CardDamageEvent;
      const originPosition = state.getCardPosition(event.initiator.instanceId);
      const targetPosition = state.getCardPosition(event.instanceId);
      if (originPosition === null || targetPosition === null) return;
      gameCanvas?.newAnimation(
        `card_${originPosition?.isPlayerCard}_${originPosition.position}`,
        `card_${targetPosition.isPlayerCard}_${targetPosition.position}`,
        "attack",
        clock.getImmutableInternalState().currentFrame
      );
		},
	});

	useGameEventListener({
		type: "playerDamage",
		action: (e, state, __, clock) => {
			const event = e as PlayerDamageEvent;
      const originPosition = state.getCardPosition(event.initiator.instanceId);
      if (originPosition === null ) return;
      gameCanvas?.newAnimation(
        `card_${originPosition.isPlayerCard}_${originPosition.position}`,
        `hpBar_${event.isPlayer}`,
        "attack",
        clock.getImmutableInternalState().currentFrame,
        {
          sameX: true,
        }
      );
		},
	});

	useGameEventListener({
		type: "healCard",
		action: (e, state, __, clock) => {
			const event = e as HealCardEvent;
      const originPosition = state.getCardPosition(event.cardInitiatorInstanceId);
      const targetPosition = state.getCardPosition(event.instanceId);
      if (originPosition === null || targetPosition === null) return;
      gameCanvas.newAnimation(
        `card_${originPosition.isPlayerCard}_${originPosition.position}`,
        `card_${targetPosition.isPlayerCard}_${targetPosition.position}`,
        "heal",
        clock.getImmutableInternalState().currentFrame
      );
		},
	});

	return { gameRef, gameCanvas };
}
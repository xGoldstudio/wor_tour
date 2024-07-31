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
		action: (e, _, __, clock) => {
			const event = e as CardDamageEvent;
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayer}_${event.initiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "attack",
        clock.getImmutableInternalState().currentFrame
      );
		},
	});

	useGameEventListener({
		type: "playerDamage",
		action: (e, _, __, clock) => {
			const event = e as PlayerDamageEvent;
      gameCanvas?.newAnimation(
        `card_${event.initiator.isPlayer}_${event.initiator.cardPosition}`,
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
		action: (e, _, __, clock) => {
			const event = e as HealCardEvent;
      gameCanvas.newAnimation(
        `card_${event.cardInitiator.isPlayerCard}_${event.cardInitiator.cardPosition}`,
        `card_${event.isPlayerCard}_${event.cardPosition}`,
        "heal",
        clock.getImmutableInternalState().currentFrame
      );
		},
	});

	return { gameRef, gameCanvas };
}
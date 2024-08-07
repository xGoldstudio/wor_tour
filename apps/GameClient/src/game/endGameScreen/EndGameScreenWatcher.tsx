import EndGameModal from "./EndGameModal";
import useGameStore from "../stores/gameStateStore";
import {
	useGameEventListener,
	useRegisterAnimation
} from "@repo/ui";
import { useState } from "react";
import { HEART_DEATH_ANIMATION_DURATION } from "../gui/PlayerHeart";

export default function EndGameScreenWatcher() {
  const getCurrentWinner = useGameStore((s) => s.state.getCurrentWinner());
  const [isGameOver, setIsGameOver] = useState(false);
  const { registerAnimation } = useRegisterAnimation();

  useGameEventListener({
    type: "gameOver",
    action: () => {
      registerAnimation({
        duration: HEART_DEATH_ANIMATION_DURATION,
        onEnd: () => {
          setIsGameOver(true);
        },
        computeStyle: () => {},
      });
    },
  });

  if (!isGameOver) {
    return null;
  }

  return <EndGameModal currentWinner={getCurrentWinner} />;
}

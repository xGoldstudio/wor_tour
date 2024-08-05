import { useGameEventListener } from "@repo/ui";
import { CurrentWinner } from "game_engine";
import { useState } from "react";
import EndGameScreen from "./EndGameScreen";

export default function EndGameScreenWatcher() {
  const [currentWinner, setCurrentWinner] = useState<CurrentWinner>(null);

	useGameEventListener({
    type: "gameOver",
    action: (_, state) => {
      setCurrentWinner(state.currentWinner);
    },
  });

	if (!currentWinner) {
		return null;
	}

	return <EndGameScreen isWinner={currentWinner === "player"} />;
}
import EndGameModal from "./EndGameModal";
import useGameInterface from "../stores/gameInterfaceStore";
import useGameStore from "../stores/gameStateStore";

export default function EndGameScreenWatcher() {
  const isGameOver = useGameInterface(s => s.gameOver);
  const isWinner = useGameStore(s => s.state.isPlayerWinner());

	if (!isGameOver) {
		return null;
	}

	return <EndGameModal isWinner={isWinner} />;
}
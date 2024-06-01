import { DebugButton } from "./game/GameDebugPanel";
import usePlayerStore from "./home/store/playerStore";

export default function DebugPanel() {
  const { addGold } = usePlayerStore((state) => ({ addGold: state.addGold }));

	return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <div className="flex gap-4">
        <DebugButton onClick={() => addGold(1000)}>Give 1000 gold</DebugButton>
        <DebugButton onClick={() => addGold(1000000)}>Give 1 000 000 gold</DebugButton>
      </div>
    </div>
	)
}
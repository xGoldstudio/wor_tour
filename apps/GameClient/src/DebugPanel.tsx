import { DebugButton } from "./game/GameDebugPanel";
import usePlayerStore from "./home/store/playerStore";

export default function DebugPanel() {
  const { addGold, addTrophies, removeTrophies } = usePlayerStore((state) => ({
    addGold: state.addGold,
    addTrophies: state.addTrophies,
    removeTrophies: state.removeTrohpies,
  }));

  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <div className="flex gap-4">
        <DebugButton onClick={() => addGold(1000)}>Give 1000 gold</DebugButton>
        <DebugButton onClick={() => addGold(1000000)}>
          Give 1 000 000 gold
        </DebugButton>
      </div>
      <p>Trophies: </p>
      <div className="grid grid-cols-4 gap-4">
        <DebugButton onClick={() => addTrophies(1000)}>+1000</DebugButton>
        <DebugButton onClick={() => addTrophies(100)}>+100</DebugButton>
        <DebugButton onClick={() => addTrophies(10)}>+10</DebugButton>
        <DebugButton onClick={() => addTrophies(1)}>+1</DebugButton>
        <DebugButton onClick={() => removeTrophies(1000)}>-1000</DebugButton>
        <DebugButton onClick={() => removeTrophies(100)}>-100</DebugButton>
        <DebugButton onClick={() => removeTrophies(10)}>-10</DebugButton>
        <DebugButton onClick={() => removeTrophies(1)}>-1</DebugButton>
      </div>
    </div>
  );
}

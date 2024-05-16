import { DebugButton } from "./game/GameDebugPanel";

export default function DebugPanel() {
	return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <div className="flex gap-4">
        <DebugButton onClick={() => {}}>Give 1000 gold</DebugButton>
      </div>
    </div>
	)
}
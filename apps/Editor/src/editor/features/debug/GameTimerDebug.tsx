import { GameTimer, useOnMount, useRunGameInstance } from "@repo/ui";
import DebugPanelLayout from "./DebugPanelLayout";
import { triggerStartEarningMana } from "game_engine";

export default function GameTimerDebug() {
  const instance = useRunGameInstance({ log: true, skipStartGame: true });
  const { clock, state } = instance;

  useOnMount(() => {
    if (!clock || !state) return;
    triggerStartEarningMana(clock, true);
  })

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
          </div>
          <div className="flex gap-4">
          </div>
          <GameTimer />
        </DebugPanelLayout>
      </div>
    </div>
  );
}

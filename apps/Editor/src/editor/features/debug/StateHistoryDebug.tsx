import {
  Button,
  StatesHistory,
  useOnMount,
  useRunGameInstance,
} from "@repo/ui";
import DebugPanelLayout from "./DebugPanelLayout";
import {
  bleedingStateTest,
  divineShieldTest,
  healStateDefaultTest,
  massacreStateTest,
  riposteStateTest,
  sacredDuelistTest,
  triggerAddState,
  triggerStartEarningMana,
} from "game_engine";
import { getRandomElement } from "@repo/lib";
import { useState } from "react";

const debugStates = [
  bleedingStateTest,
  massacreStateTest,
  healStateDefaultTest,
  riposteStateTest,
  divineShieldTest,
  sacredDuelistTest,
];

export default function StateHistoryDebug() {
  const instance = useRunGameInstance({ skipStartGame: true });
  const { clock, state } = instance;

  useOnMount(() => {
    if (!clock || !state) return;
    triggerStartEarningMana(clock, true);
  });

  function addRandomState(amount: number) {
    if (!clock || !state) return;
    for (let i = 0; i < amount; i++) {
      triggerAddState(clock, -1, getRandomElement(debugStates));
    }
  }

  const [addingStatesTimer, setAddingStatesTimer] =
    useState<null | NodeJS.Timeout>(null);

  function toggleStatesAdding() {
    if (addingStatesTimer) {
      clearInterval(addingStatesTimer);
      setAddingStatesTimer(null);
      return;
    }
    addRandomState(1);
    setAddingStatesTimer(
      setInterval(() => {
        addRandomState(1);
      }, 1000)
    );
  }

  return (
    <div>
      <div className="w-full flex justify-center pt-16 gap-32">
        <div className="w-150px h-[600px]">
          <StatesHistory setFocusedCard={() => {}}/>
        </div>
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => addRandomState(1)}>Add random state</Button>
            <Button action={() => addRandomState(3)}>Add 3 random state</Button>

            <Button
              action={toggleStatesAdding}
              rarity={addingStatesTimer !== null ? "epic" : "rare"}
            >
              Add states
            </Button>
          </div>
          <div className="flex gap-4"></div>
        </DebugPanelLayout>
      </div>
    </div>
  );
}

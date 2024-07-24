import { Button, ManaBar, useGameEventListener, useOnMount } from "@repo/ui";
import DebugPanelLayout from "./DebugPanelLayout";
import { useRunInstance } from "./useRunGameInstance";
import { StartEarningMana, triggerConsumeMana, triggerIncreaseMana } from "game_engine";

export default function ManaBarDebug() {
  const instance = useRunInstance(false);
  const { clock, state } = instance;

  useOnMount(() => {
    if (!clock || !state) return;
    triggerIncreaseMana(clock, true);
  })

  function consumeMana(amount: number) {
    if (!clock || !state) return;
    triggerConsumeMana(clock, true, amount);
  }

  function increaseMana() {
    if (!clock || !state) return;
    triggerIncreaseMana(clock, true);
  }

  function consumeMaxMana() {
    if (!clock || !state) return;
    triggerConsumeMana(clock, true, state.playerMana);
  }

  useGameEventListener({
    type: null,
    action: (event, state) => {
      console.log(event, state);
    },
  })

  useGameEventListener({
    type: "startEarningMana",
    action: (event, state) => {
      console.log(event, state.playerManaSpeed, state.playerMana);
    },
    filter: (event) => (event as StartEarningMana).isPlayer,
  })

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => consumeMaxMana()}>Consume max</Button>
            <Button action={() => consumeMana(1)}>Consume 1</Button>
            <Button action={() => consumeMana(2)}>Consume 2</Button>
            <Button action={() => increaseMana()}>Increase</Button>
          </div>
          <div className="flex gap-4">
          </div>
          <ManaBar />
        </DebugPanelLayout>
      </div>
    </div>
  );
}

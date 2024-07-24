import { Button, ManaBar, useOnMount } from "@repo/ui";
import DebugPanelLayout from "./DebugPanelLayout";
import { useRunInstance } from "./useRunGameInstance";
import { MAX_MANA, triggerConsumeMana, triggerIncreaseMana, triggerStartEarningMana } from "game_engine";

export default function ManaBarDebug() {
  const instance = useRunInstance(false);
  const { clock, state } = instance;

  useOnMount(() => {
    if (!clock || !state) return;
    triggerStartEarningMana(clock, true);
  })

  function consumeMana(amount: number) {
    if (!clock || !state) return;
    triggerConsumeMana(clock, true, amount);
  }

  function increaseMana(amount: number) {
    if (!clock || !state) return;
    triggerIncreaseMana(clock, true, amount);
  }

  function consumeMaxMana() {
    if (!clock || !state) return;
    triggerConsumeMana(clock, true, state.playerMana);
  }

  function increaseMaxMana() {
    if (!state) return;
    increaseMana(MAX_MANA - state.getMana(true));
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => consumeMaxMana()}>Consume max</Button>
            <Button action={() => consumeMana(1)}>Consume 1</Button>
            <Button action={() => consumeMana(2)}>Consume 2</Button>
            <Button action={() => increaseMaxMana()}>Increase max</Button>
            <Button action={() => increaseMana(1)}>Increase 1</Button>
            <Button action={() => increaseMana(2)}>Increase 2</Button>
          </div>
          <div className="flex gap-4">
          </div>
          <ManaBar />
        </DebugPanelLayout>
      </div>
    </div>
  );
}

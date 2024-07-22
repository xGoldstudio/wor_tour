import { CardState, getOptionsFromType } from "@repo/lib";
import { Button, GameCard } from "@repo/ui";
import {
  bleedingStateTest,
  massacreStateTest,
  multiAttackState,
  riposteStateTest,
  triggerDirectAttackResolved,
  triggerHealCard,
} from "game_engine";
import { defaultActions, useRunInstance } from "./useRunGameInstance";

export default function InGameCardDebug() {
  const instance = useRunInstance();
  const { clock, state, pause, setSpeed, speed, isPlaying, runTicks } =
    instance ?? {};

  function addState(stateArg: CardState) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "addState",
      instanceId,
      isPlayerCard: true,
      position: 0,
      state: stateArg,
    });
  }

  function removeState(stateType: CardState["type"]) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "removeState",
      instanceId,
      isPlayerCard: true,
      position: 0,
      stateType,
    });
  }

  function consumeState(stateType: CardState["type"], consumeState: number) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "decreaseStateValue",
      instanceId,
      isPlayerCard: true,
      position: 0,
      stateType,
      decreaseBy: consumeState,
    });
  }

  function dealDamage(amount: number) {
    if (!clock || !state) return;
    triggerDirectAttackResolved(clock, state, false, 0, amount);
  }

  function healCard(amount: number) {
    if (!clock || !state) return;
    triggerHealCard(clock, true, 0, amount);
  }

  function addRemoveState(state: CardState) {
    const options = getOptionsFromType(state.type);
    return (
      <>
        <Button action={() => addState(state)} full>
          Add {state.type}
        </Button>
        <Button action={() => removeState(state.type)} full rarity="common">
          Remove {state.type}
        </Button>
        <Button
          action={() => consumeState(state.type, options.consume!)}
          full
          rarity="epic"
          disabled={options.consume === undefined}
        >
          Consume {state.type}
        </Button>
      </>
    );
  }

  function setSpeedButton(speedArg: number) {
    return (
      <Button
        action={() => setSpeed?.(speedArg)}
        rarity={speed === 1 / speedArg && isPlaying ? "epic" : "rare"}
        full
      >
        x{speedArg}
      </Button>
    );
  }

  function addTicksButton(ticks: number) {
    return (
      <Button action={() => runTicks?.(ticks)} full>
        +{ticks} ticks
      </Button>
    );
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <div className="h-[333.75px] w-[240px] flex justify-center items-center border-2 border-black p-2 box-content">
          <div className="scale-150">
            <GameCard isPlayerCard={true} position={0} />
          </div>
        </div>
        <div className="flex gap-4 h-full flex-col justify-center">
          <p className="text-2xl font-semibold">Game management</p>
          <div className="grid grid-cols-5 gap-4">
            <Button
              action={() => pause?.()}
              rarity={isPlaying ? "rare" : "epic"}
              full
            >
              Pause
            </Button>
            {setSpeedButton(0.25)}
            {setSpeedButton(0.5)}
            {setSpeedButton(1)}
            {setSpeedButton(2)}
            {addTicksButton(1)}
            {addTicksButton(10)}
          </div>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => defaultActions(clock)}>PlaceCard</Button>
            <Button action={() => dealDamage(10)}>Deal damage</Button>
            <Button action={() => dealDamage(9999)}>Kill card</Button>
            <Button action={() => healCard(10)}>Heal card</Button>
          </div>
          <p className="text-2xl font-semibold">States</p>
          <div className="grid grid-cols-3 gap-4">
            {addRemoveState(bleedingStateTest)}
            {addRemoveState(multiAttackState)}
            {addRemoveState(riposteStateTest)}
            {addRemoveState(massacreStateTest)}
          </div>
        </div>
      </div>
    </div>
  );
}

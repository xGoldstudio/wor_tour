import { Button, GameCard, useOnMount, useRunGameInstance } from "@repo/ui";
import {
  bleedingStateTest,
  ClockReturn,
  cloneStateTest,
  drawPlaceCard,
  EventType,
  GameStateObject,
  massacreStateTest,
  multiAttackState,
  rageStateTest,
  riposteStateTest,
  sacredDuelistTest,
  scorchTest,
  triggerChangeAttackSpeed,
  triggerDirectAttackResolved,
  triggerHealCard,
  CardState,
  getOptionsFromType,
} from "game_engine";
import DebugPanelLayout from "./DebugPanelLayout";
import { useDummyCard } from "./useDummyCard";

function defaultActions(clock: ClockReturn<EventType>, state: GameStateObject) {
  if (!clock || !state) return;
  drawPlaceCard(clock, true, 0, state);
}

export default function InGameCardDebug() {
  const dummyCard = useDummyCard();
  const instance = useRunGameInstance({
    gameData: {
      playerDeck: [dummyCard],
    },
    skipStartGame: true,
  });
  const { clock, state } = instance;

  useOnMount(() => {
    defaultActions(clock, state);
  });

  function addState(stateArg: CardState) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "addState",
      instanceId,
      state: stateArg,
    });
  }

  function removeState(stateType: CardState["type"]) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "beforeRemoveState",
      instanceId,
      stateType,
    });
  }

  function consumeState(stateType: CardState["type"], consumeState: number) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "decreaseStateValue",
      instanceId,
      stateType,
      decreaseBy: consumeState,
    });
  }

  function dealDamage(amount: number, directDamage: boolean) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (!clock || !state || instanceId === undefined) return;
    triggerDirectAttackResolved(
      clock,
      state,
      instanceId,
      instanceId,
      amount,
      directDamage ? undefined : true
    );
  }

  function healCard(amount: number) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (!clock || !state || instanceId === undefined) return;
    triggerHealCard(clock, instanceId, amount);
  }

  function changeAs(amount: number) {
    const instanceId = state?.getCard(true, 0)?.instanceId;
    if (instanceId === undefined) return;
    triggerChangeAttackSpeed(clock, instanceId, amount);
  }

  function addRemoveState(state: CardState) {
    const options = getOptionsFromType(state.type);
    return (
      <>
        <Button action={() => addState(state)} full>
          Add {state.type} {state.value !== null && `(${state.value})`}
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

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <div className="h-[333.75px] w-[240px] flex justify-center items-center border-2 border-black p-2 box-content">
          <div className="scale-150">
            <GameCard isPlayerCard={true} position={0} />
          </div>
        </div>
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => defaultActions(clock, state)}>
              PlaceCard
            </Button>
            <Button action={() => dealDamage(10, true)}>Deal damage</Button>
            <Button action={() => dealDamage(10, false)}>
              Deal undirect damage
            </Button>
            <Button action={() => dealDamage(9999, true)}>Kill card</Button>
            <Button action={() => healCard(10)}>Heal card</Button>
            <Button action={() => changeAs(10)}>Increase AS</Button>
            <Button action={() => changeAs(-10)}>Decrease AS</Button>
          </div>
          <p className="text-2xl font-semibold">States</p>
          <div className="grid grid-cols-3 gap-4">
            {addRemoveState(bleedingStateTest)}
            {addRemoveState(multiAttackState)}
            {addRemoveState(riposteStateTest)}
            {addRemoveState(massacreStateTest)}
            {addRemoveState(cloneStateTest)}
            {addRemoveState(sacredDuelistTest)}
            {addRemoveState({ ...rageStateTest, value: 22 } as CardState)}
            {addRemoveState({ ...rageStateTest, value: 250 } as CardState)}
            {addRemoveState(scorchTest)}
          </div>
        </DebugPanelLayout>
      </div>
    </div>
  );
}

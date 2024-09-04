import { CardState } from "@repo/lib";
import { Button, HandCard, useOnMount, useRunGameInstance } from "@repo/ui";
import {
  bleedingStateTest,
  ClockReturn, EventType,
  getOptionsFromType,
  riposteStateTest,
  scorchTest
} from "game_engine";
import DebugPanelLayout from "./DebugPanelLayout";
import { useDummyCard } from "./useDummyCard";

function defaultActions(clock?: ClockReturn<EventType>) {
  if (!clock) return;
  clock.triggerEvent({
    type: "drawCard",
    position: 0,
    isPlayer: true,
  });
}

export default function HandCardDebug() {
  const dummyCard = useDummyCard();
  const instance = useRunGameInstance({
    gameData: {
      playerDeck: [{...dummyCard, rarity: "rare"}, {...dummyCard, rarity: "common"}],
    },
    skipStartGame: true,
  });
  const { clock, state } = instance;

  useOnMount(() => {
    defaultActions(clock);
  });

  function addState(stateArg: CardState) {
    const instanceId = state?.playerHand[0]?.id;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "addDeckCardState",
      instanceId,
      state: stateArg,
    });
  }

  function consumeState(stateType: CardState["type"], consumeState: number) {
    const instanceId = state?.playerHand[0]?.id;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "decreaseDeckCardStateValue",
      instanceId,
      stateType,
      decreaseBy: consumeState,
    });
  }

  function removeState(stateType: CardState["type"]) {
    const instanceId = state?.playerHand[0]?.id;
    if (instanceId === undefined) return;
    clock?.triggerEvent({
      type: "removeDeckCardState",
      instanceId,
      stateType,
    });
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
          <div className="scale-[200%]">
            <HandCard position={0} />
          </div>
        </div>
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4">
            <Button action={() => defaultActions(clock)}>Draw Card</Button>
          </div>
          <p className="text-2xl font-semibold">States</p>
          <div className="grid grid-cols-3 gap-4">
            {addRemoveState(bleedingStateTest)}
            {addRemoveState(riposteStateTest)}
            {addRemoveState(scorchTest)}
            {addRemoveState({ ...scorchTest, value: 50 } as CardState)}
          </div>
        </DebugPanelLayout>
      </div>
    </div>
  );
}

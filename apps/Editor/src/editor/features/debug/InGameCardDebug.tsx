import useEditorStore from "@/editor/store/EditorStore";
import { CardState, CardType } from "@repo/lib";
import {
  Button,
  GameCard,
  runGameEventListeners,
  useGameSyncAnimationStore,
} from "@repo/ui";
import { bleedingStateTest, ClockReturn, drawPlaceCard, EventType, initTest } from "game_engine";
import { useEffect, useRef } from "react";

const dummyCard: CardType = {
  name: "Dummy",
  cost: 1,
  illustration: "string",
  worldIllustration: "string",
  dmg: 0,
  hp: 200,
  attackSpeed: 0,
  states: [],
  level: 1,
  world: 1,
  rarity: "common",
  id: 0,
};

export default function InGameCardDebug() {
  const cardIllustartion = useEditorStore(
    (state) => state.cards[21]?.stats[2].illustration
  );
  const worldIllustration = useEditorStore(
    (state) => state.worlds[1].cardBackground
  );
  dummyCard.illustration = cardIllustartion ?? "";
  dummyCard.worldIllustration = worldIllustration ?? "";
  const clock = useRun();

	function addState(state: CardState) {
		clock?.triggerEvent({ type: "addState", isPlayerCard: true, cardPosition: 0, state });
	}

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <div className="h-[333.75px] w-[240px] flex justify-center items-center">
          <div className="scale-150">
            <GameCard isPlayerCard={true} position={0} />
          </div>
        </div>
        <div className="flex gap-4 h-full flex-col justify-center">
          <Button action={() => clock && defaultActions(clock)}>PlaceCard</Button>
          <Button action={() => addState(bleedingStateTest)}>Add blood</Button>
          <Button action={() => {}}>Salut</Button>
        </div>
      </div>
    </div>
  );
}

function useRun() {
  const { triggerGameSyncAnimation } = useGameSyncAnimationStore();
  const clockRef = useRef<ClockReturn<EventType> | null>(null);
  useEffect(() => {
    const { clock, state } = initTest({
      sideEffectOnFrame: ({ event, state, clock }) => {
        runGameEventListeners(
          event.type,
          event,
          state,
          clock.triggerEvent,
          clock
        );
      },
      playerDeck: [dummyCard],
    });
    clockRef.current = clock;

    defaultActions(clock);
    // loop
    function nextTick() {
      window.requestAnimationFrame(() => {
        clock.nextTick();
        nextTick();
        triggerGameSyncAnimation(
          state,
          clock.getImmutableInternalState().currentFrame
        );
      });
    }
    nextTick();
  }, []);

  return clockRef.current;
}

function defaultActions(clock: ClockReturn<EventType>) {
  drawPlaceCard(clock, true, 0);
}

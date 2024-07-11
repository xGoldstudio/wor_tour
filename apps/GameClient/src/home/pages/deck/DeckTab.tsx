import usePlayerStore from "@/home/store/playerStore";
import { getTargetStrength, ManaBall } from "@repo/ui";
import * as _ from "lodash";
import ScrollContainer from "react-indiana-drag-scroll";
import { Card } from "./cardFilters";
import Collection from "./Collection";
import { DeckCardUI } from "./DeckCardUI";

export const NUMBER_OF_CARD_IN_DECK: number = 8;

interface DeckStatsProps {
  averageCostDeck: number;
  powerTotal: number;
}

function DeckStats({ averageCostDeck, powerTotal }: DeckStatsProps) {
  console.log(powerTotal.toFixed(0));
  return (
    <div className="flex w-full justify-between items-center m-2 pt-4 h-[75px] mx-auto px-4 ">
      <div className="flex items-center text-white gap-2 text-2xl bold ">
        {averageCostDeck.toFixed(1)}
        <ManaBall />
      </div>
      <div className="flex items-center">
        <span className=" text-white text-2xl bold ">
          {powerTotal.toFixed(0)}
        </span>
        <img
          src="/icons/epees-bouclier.png"
          alt="swords and a shield"
          width={58}
          height={58}
          className="opacity-60"
        />
      </div>
    </div>
  );
}

export default function DeckTab() {
  const { deck, getCompleteInfo } = usePlayerStore((state) => ({
    deck: state.deck,
    getCompleteInfo: state.getCompleteInfo,
  }));

  const deckArray = _.concat(
    deck,
    _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  );
  const detailledDeck: Card[] = [];
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));

  const powerTotal = detailledDeck.reduce(
    (total, card) => total + getTargetStrength(card),
    0
  );
  const averageCostDeck =
    detailledDeck.reduce((total, card) => total + card.cost, 0) /
    detailledDeck.length;
  const { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(state.getCollection()),
  }));
  return (
    <div>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hiden flex flex-col h-[674px] w-full">
        <div className="grid grid-rows-[1fr_auto] top-0 ">
          <div className="grid grid-cols-4 gap-y-8 pt-8">
            {detailledDeck.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI cardId={card.id} />
              </div>
            ))}
          </div>
        </div>
        <DeckStats averageCostDeck={averageCostDeck} powerTotal={powerTotal} />
        Collection :
        <Collection detailledCollection={detailledCollection} />
      </ScrollContainer>
    </div>
  );
}

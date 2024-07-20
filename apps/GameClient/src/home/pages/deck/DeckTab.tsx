import usePlayerStore from "@/home/store/playerStore";
import { ManaBall } from "@repo/ui";
import * as _ from "lodash";
import ScrollContainer from "react-indiana-drag-scroll";
import { CardCollection } from "./cardFilters";
import { DeckCardUI } from "./DeckCardUI";
import Collection from "./Collection";
import { getTargetStrength } from "@repo/lib";

export const NUMBER_OF_CARD_IN_DECK: number = 8;

interface DeckStatsProps {
  detailledDeck: CardCollection[];
}

function DeckStats({ detailledDeck }: DeckStatsProps) {
  const powerTotal = detailledDeck.reduce(
    (total, card) => total + getTargetStrength(card),
    0
  );
  const averageCostDeck =
    detailledDeck.reduce((total, card) => total + card.cost, 0) /
    detailledDeck.length;
  return (
    <div className="flex w-full justify-between items-center m-2 pt-4 h-[75px] mx-auto px-4 ">
      <div className="flex items-center text-white gap-2 text-2xl bold ">
        <ManaBall size={30} />
        {averageCostDeck.toFixed(1)}
      </div>
      <div className="flex items-center">
        <span className=" text-white text-2xl bold ">
          {powerTotal.toFixed(0)}
        </span>
        <img
          src="/icons/epees-bouclier.png"
          alt="swords and a shield"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
}

export default function DeckTab() {
  const { deck, getCompleteInfo, numberOfCardsInDeck } = usePlayerStore(
    (state) => ({
      deck: state.deck,
      getCompleteInfo: state.getCompleteInfo,
      numberOfCardsInDeck: state.numberOfCardsInDeck,
    })
  );

  const deckArray = _.concat(
    deck,
    _.fill(Array(numberOfCardsInDeck - deck.length), null)
  );
  const detailledDeck: CardCollection[] = [];
  for (let i = 0; i < numberOfCardsInDeck; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));
  return (
    <div>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hiden flex flex-col h-[674px] w-[650px]">
        <div className="grid grid-rows-[1fr_auto] top-0 ">
          <div className="grid grid-cols-4 gap-y-8 pt-8 ">
            {detailledDeck.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI cardId={card.id} />
              </div>
            ))}
          </div>
        </div>
        <DeckStats detailledDeck={detailledDeck} />
        {/* <Collection /> */}
      </ScrollContainer>
    </div>
  );
}

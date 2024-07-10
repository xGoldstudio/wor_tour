import * as _ from "lodash";
import usePlayerStore from "@/home/store/playerStore";
import { DeckCardUI } from "./DeckCardUI";
import ScrollContainer from "react-indiana-drag-scroll";
import { Card } from "./cardFilters";
import { textureByRarity } from "@repo/ui";

export const NUMBER_OF_CARD_IN_DECK: number = 8;

interface DeckStatsProps {
  averageCostDeck: number;
}

function DeckStats({ averageCostDeck }: DeckStatsProps) {
  return (
    <div className="flex w-full justify-between m-2 pt-4 h-[75px]">
      <svg width="30%" height="100%">
        <rect width="100%" height="100%" />
        <image
          className="blur-[6px]"
          href={textureByRarity("common")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />{" "}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#A4449C"
          className="font-bold text-lg "
        >
          Average Cost : {averageCostDeck.toFixed(1)}
        </text>
      </svg>
      <svg width="30%" height="100%">
        <rect width="100%" height="100%" />
        <image
          className="blur-[6px]"
          href={textureByRarity("common")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />{" "}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          className="font-bold text-lg"
        >
          Total Power : 74
        </text>
      </svg>
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

  const averageCostDeck =
    detailledDeck.reduce((total, card) => total + card.cost, 0) /
    detailledDeck.length;
  const { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(state.getCollection()),
  }));
  return (
    <div>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hiden flex flex-col h-[674px] w-[650px]">
        <div className="grid grid-rows-[1fr_auto] top-0 ">
          <div className="grid grid-cols-4 gap-y-8 pt-8">
            {detailledDeck.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI cardId={card.id} />
              </div>
            ))}
          </div>
        </div>
        <DeckStats averageCostDeck={averageCostDeck} />
        Collection :
        <div className="grid grid-cols-4 gap-y-8 pt-8">
          {detailledCollection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCardUI cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
}

import usePlayerStore from "@/home/store/playerStore";
import { getTargetStrength } from "@repo/lib";
import { ManaBall } from "@repo/ui";
import * as _ from "lodash";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { CardCollection } from "./cardFilters";
import { NUMBER_OF_CARD_IN_DECK } from "./cardSorts";
import Collection from "./Collection";
import { DeckCardUI } from "./DeckCardUI";
import { Tabs } from "./DeckInterface";
import { useEditionMode } from "./context/UseEditionMode";

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
          {powerTotal.toFixed(1)}
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

export type selectedCardType = { id: number; tab: Tabs | null };

export default function DeckTab() {
  const { deck, getCompleteInfo, collectionInDeck } = usePlayerStore(
    (state) => ({
      deck: state.deck,
      getCompleteInfo: state.getCompleteInfo,
      numberOfCardsInDeck: state.numberOfCardsInDeck,
      currentMissingCards: state.currentMissingCards,
      collectionInDeck: state.getCollectionNotInDeck(state.getCollection()),
    })
  );
  const { editionMode } = useEditionMode();
  const [selectedCard, setSelectedCard] = useState<selectedCardType>({
    id: 0,
    tab: null,
  });
  const deckArray = _.concat(
    deck,
    _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  );
  const detailledDeck: CardCollection[] = [];
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));
  return (
    <div>
      <ScrollContainer className="grow scrollbar-hiden flex flex-col h-[674px] w-[650px] overflow-y-scroll">
        <div className="grid grid-rows-[1fr_auto]  ">
          <div className="grid grid-cols-4 gap-y-8 pt-8 ">
            {detailledDeck.map((card, index) => (
              <div className="w-full flex justify-center" key={index}>
                <DeckCardUI
                  cardId={card.id}
                  setSelectedCard={() =>
                    setSelectedCard({ id: card.id, tab: "Deck" })
                  }
                  selectedCard={selectedCard}
                  tab="Deck"
                />
              </div>
            ))}
          </div>
        </div>
        <DeckStats detailledDeck={detailledDeck} />
        {editionMode && (
          <Collection
            collection={collectionInDeck}
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
            classname={"h-full pb-4"}
          />
        )}
      </ScrollContainer>
    </div>
  );
}

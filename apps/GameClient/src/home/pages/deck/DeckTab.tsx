import { CardType, filterUndefined, getImageUrl, ICONS } from "@repo/lib";
import { ManaBall } from "@repo/ui";
import * as _ from "lodash";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { useEditionMode } from "./context/UseEditionMode";
import { DeckCardUI } from "./DeckCardUI";
import { NUMBER_OF_CARD_IN_DECK } from "@/const";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { getDeckStrength } from "@/services/MatchmakingService/buildDeck";

interface DeckStatsProps {
  deck: CardType[];
}

function DeckStats({ deck }: DeckStatsProps) {
  const powerTotal = getDeckStrength(deck);

  const averageCostDeck =
    deck.reduce((total, card) => total + card.cost, 0) / deck.length;
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
          src={getImageUrl(ICONS, "epees-bouclier.png")}
          alt="swords and a shield"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
}

function EmptyDeckPlaceholder() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="mb-2 h-[178px] w-[128px] bg-black bg-opacity-20 border border-slate-700 border-opacity-25 backdrop-filter backdrop-blur-sm rounded-sm " />
    </div>
  );
}

export type selectedCardType = { id: number };

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
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const deckArray = _.concat(
    deck,
    _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  );
  const detailledDeck: (CardType | undefined)[] = [];
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++) {
    const cardId = deckArray[i];
    detailledDeck.push(cardId ? getCompleteInfo(cardId) : undefined);
  }
  return (
    <div>
      <ScrollContainer className="grow scrollbar-hiden flex flex-col h-[674px] w-[650px] overflow-y-scroll">
        <div className="grid grid-rows-[1fr_auto]  ">
          <div className="grid grid-cols-4 gap-y-6 pt-8 ">
            {detailledDeck.map((card, index) =>
              !card ? (
                <EmptyDeckPlaceholder />
              ) : (
                <div className="w-full flex justify-center" key={index}>
                  <DeckCardUI
                    cardId={card.id}
                    setSelectedCard={setSelectedCard}
                    selectedCard={selectedCard}
                  />
                </div>
              )
            )}
          </div>
        </div>
        <DeckStats deck={filterUndefined(detailledDeck)} />
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

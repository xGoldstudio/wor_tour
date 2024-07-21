import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import { ActiveFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { SortAndFilterBox } from "./SortAndFilterBox";
import { getCardsFiltered } from "./getCardsFiltered";
import { Tabs } from "./DeckInterface";

interface CollectionProps {
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard?: (cardId: number) => void;
  selectedCard?: number;
}

export default function Collection({
  setCurrentTab,
  setSelectedCard,
  selectedCard,
}: CollectionProps) {
  let { detailledCollection, cardNotFound } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(state.getCollection()),
    cardNotFound: state.getAllCardsLocked(),
  }));
  const [currentSort, setcurrentSort] = useState<CardSorts>(defaultSort);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const [currentFilter, setCurrentFilter] = useState<ActiveFilters>({
    Common: false,
    Rare: false,
    Epic: false,
    Legendary: false,
    Level: {
      min: FiltersDescription.Level.rangeMin!,
      max: FiltersDescription.Level.rangeMax!,
    },
    Cost: {
      min: FiltersDescription.Cost.rangeMin!,
      max: FiltersDescription.Cost.rangeMax!,
    },
  });

  const collectionLength = detailledCollection.length;

  detailledCollection = getCardsFiltered({
    detailledCollection,
    currentFilter,
  });
  detailledCollection = sorts[currentSort].sortFunction(
    detailledCollection,
    isAscending
  );
  cardNotFound = getCardsFiltered({
    detailledCollection: cardNotFound,
    currentFilter,
  });
  cardNotFound = sorts[currentSort].sortFunction(cardNotFound, isAscending);
  return (
    <div className="flex flex-col h-[674px] w-[650px] ">
      <div className="grid grid-rows-[1fr_auto] top-0 pb-20">
        <SortAndFilterBox
          collectionLength={collectionLength}
          currentSort={currentSort}
          setCurrentSort={setcurrentSort}
          isAscending={isAscending}
          setIsAscending={setIsAscending}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />
        <div className="w-[600px] mx-auto grid grid-cols-4 gap-y-6 pt-10 pb-8">
          {detailledCollection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCardUI
                cardId={card.id}
                setCurrentTab={setCurrentTab}
                selectedCard={selectedCard}
                setSelectedCard={() => setSelectedCard!(card.id)}
              />
            </div>
          ))}
          {cardNotFound.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCardUI
                cardId={card.id}
                locked={true}
                unaddble={true}
                selectedCard={selectedCard}
                setSelectedCard={() => setSelectedCard!(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

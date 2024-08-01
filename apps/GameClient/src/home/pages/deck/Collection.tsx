import { CardType } from "@repo/lib";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { Tabs } from "./DeckInterface";
import { getCardsFiltered } from "./getCardsFiltered";
import { SortAndFilterBox } from "./SortAndFilterBox";
import usePlayerStore from "@/home/store/playerStore";

interface CollectionProps {
  collection: (CardType & { isInDeck: boolean })[];
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard: (id: number) => void;
  selectedCard: number;
  classname?: string;
}

export default function Collection({
  collection,
  setCurrentTab,
  setSelectedCard,
  selectedCard,
  classname = "pb-24",
}: CollectionProps) {
  let { cardNotFound } = usePlayerStore((state) => ({
    cardNotFound: state.getAllCardsLocked(),
  }));
  const [currentSort, setcurrentSort] = useState<CardSorts>(defaultSort);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const [currentFilter, setCurrentFilter] = useState<ActiveFilters>({
    Cost: {
      min: FiltersDescription.Cost.rangeMin!,
      max: FiltersDescription.Cost.rangeMax!,
    },
    Common: false,
    Rare: false,
    Epic: false,
    Legendary: false,
    Level: {
      min: FiltersDescription.Level.rangeMin!,
      max: FiltersDescription.Level.rangeMax!,
    },
  });
  let detailledCollection = [...collection];
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
    <div className="flex flex-col w-[650px] ">
      <div className="grid grid-rows-[1fr_auto] top-0  ">
        <div className=" ">
          <SortAndFilterBox
            collectionLength={collectionLength}
            currentSort={currentSort}
            setCurrentSort={setcurrentSort}
            isAscending={isAscending}
            setIsAscending={setIsAscending}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>
        <ScrollContainer
          className={`grow overflow-y-scroll scrollbar-hiden flex flex-col h-[674px] w-[650px], ${classname}`}
        >
          <div className="w-[600px] mx-auto grid grid-cols-4 gap-y-6 pt-10 ">
            {detailledCollection.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI
                  cardId={card.id}
                  setCurrentTab={setCurrentTab}
                  setSelectedCard={setSelectedCard}
                  selectedCard={selectedCard}
                />
              </div>
            ))}
            {cardNotFound.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI
                  cardId={card.id}
                  locked={true}
                  setSelectedCard={setSelectedCard}
                  selectedCard={selectedCard}
                />
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}

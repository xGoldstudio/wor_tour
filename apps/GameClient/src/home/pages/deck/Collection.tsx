import { useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { Tabs } from "./DeckInterface";
import { getCardsFiltered } from "./getCardsFiltered";
import { SortAndFilterBox } from "./SortAndFilterBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { CardType } from "game_engine";
import { DisablableDeckCardUI } from "./DisablableDeckCardUI";
import useCollectionCardsRevealed from "./useCollectionCardsRevealed";
import { createArrayOfElements } from "@repo/ui";

interface CollectionProps {
  collection: (CardType & { isInDeck: boolean })[];
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard: (id: number) => void;
  selectedCard: number;
  parentScrollRef?: React.RefObject<HTMLDivElement>;
}

export default function Collection({
  collection,
  setCurrentTab,
  setSelectedCard,
  selectedCard,
  parentScrollRef,
}: CollectionProps) {
  let { cardNotFound } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(state.getCollection()),
    cardNotFound: state.getAllCardsLocked(),
  }));
  const [currentSort, setcurrentSort] = useState<CardSorts>(defaultSort);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

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

  const allCards = [...detailledCollection, ...cardNotFound];

  const { onScroll, onScrollDebounced, firstElementToShow, lastElementToShow } =
    useCollectionCardsRevealed({
      contentRef,
      cardListRef,
      numberOfCards: allCards.length,
    });


  const content = (
    <div className="absolute top-0 left-0 w-full flex justify-center py-10 px-4">
      <div
        className="max-w-full w-fit gap-6 grid grid-cols-[repeat(auto-fill,_128px)]"
        ref={cardListRef}
      >
        {createArrayOfElements(DisablableDeckCardUI, firstElementToShow)}
        {allCards.slice(firstElementToShow, lastElementToShow).map((card) => (
          <DeckCardUI
            locked={true}
            cardId={card.id}
            setCurrentTab={setCurrentTab}
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
            key={card.id}
          />
        ))}
        {createArrayOfElements(
          DisablableDeckCardUI,
          allCards.length - lastElementToShow
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <SortAndFilterBox
        collectionLength={collectionLength}
        currentSort={currentSort}
        setCurrentSort={setcurrentSort}
        isAscending={isAscending}
        setIsAscending={setIsAscending}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      {/* { ? ( */}
        <ScrollContainer
          className={`grow h-full overflow-y-scroll scrollbar-hiden flex flex-col relative w-full`}
          onScroll={onScrollDebounced}
          onEndScroll={onScroll}
          innerRef={contentRef}
        >
          {content}
        </ScrollContainer>
      {/* ) : (
        <div className="flex flex-col relative w-full">{content}</div>
      )} */}
    </div>
  );
}

import { useMemo, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { getCardsFiltered } from "./getCardsFiltered";
import { SortAndFilterBox } from "./SortAndFilterBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { DisablableDeckCardUI } from "./DisablableDeckCardUI";
import useCollectionCardsRevealed from "./useCollectionCardsRevealed";
import { createArrayOfElements } from "@repo/ui";

interface CollectionProps {
  parentScrollRef?: React.RefObject<HTMLDivElement>;
  filterDeck?: boolean;
}

export default function Collection({
  parentScrollRef,
  filterDeck,
}: CollectionProps) {
  const { collection, deck } = usePlayerStore((state) => ({
    collection: state.collection,
    deck: state.deck,
  }));
  const [currentSort, setcurrentSort] = useState<CardSorts>(defaultSort);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const cardListRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const allCards = useMemo(() => {
    const detailledCollection = usePlayerStore
      .getState()
      .getCollectionCompleteInfo(collection, deck, !!filterDeck);
    const cardNotFound = usePlayerStore.getState().getAllCardsLocked();
    const filteredCollection = getCardsFiltered({
      detailledCollection,
      currentFilter,
    });
    const filteredAndsortedCollection = sorts[currentSort].sortFunction(
      filteredCollection,
      isAscending
    );
    const filteredNotFound = getCardsFiltered({
      detailledCollection: cardNotFound,
      currentFilter,
    });
    const sortedAndFilteredCardNotFound = sorts[currentSort].sortFunction(
      filteredNotFound,
      isAscending
    );
    return [...filteredAndsortedCollection, ...sortedAndFilteredCardNotFound];
  }, [currentFilter, currentSort, isAscending, collection, deck, filterDeck]);

  const { firstElementToShow, lastElementToShow } = useCollectionCardsRevealed({
    scrollRef: parentScrollRef ?? scrollRef,
    cardListRef,
    numberOfCards: allCards.length,
  });

  const beforeCards = useMemo(
    () => createArrayOfElements(DisablableDeckCardUI, firstElementToShow),
    [firstElementToShow]
  );

  const afterCards = useMemo(
    () =>
      createArrayOfElements(
        DisablableDeckCardUI,
        allCards.length - lastElementToShow
      ),
    [lastElementToShow]
  );

  const content = (
    <div className="absolute top-0 left-0 w-full flex justify-center py-10 px-4">
      <div
        className="max-w-full w-fit gap-6 grid grid-cols-[repeat(auto-fill,_128px)]"
        ref={cardListRef}
      >
        {beforeCards}
        {allCards.slice(firstElementToShow, lastElementToShow).map((card) => (
          <DeckCardUI card={card} key={card.id} />
        ))}
        {afterCards}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      <SortAndFilterBox
        collectionLength={collection.size}
        currentSort={currentSort}
        setCurrentSort={setcurrentSort}
        isAscending={isAscending}
        setIsAscending={setIsAscending}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />
      {!parentScrollRef ? (
        <ScrollContainer
          className={`grow h-full overflow-y-scroll scrollbar-hiden flex flex-col relative w-full`}
          innerRef={scrollRef}
        >
          {content}
        </ScrollContainer>
      ) : (
        <div className="flex flex-col relative w-full">{content}</div>
      )}
    </div>
  );
}

import { useDeferredValue, useMemo, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import {
  ActiveFilters,
  defaultFilters,
} from "./cardFilters";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cardsPipeline, setCardsPipeline] = useState<CardsPipeline>({
    filters: defaultFilters,
    sort: defaultSort,
    isAscending: true,
  });
  const deferedCardsPipeline = useDeferredValue(cardsPipeline);

  return (
    <div className="flex flex-col w-full">
      <SortAndFilterBox
        cardsPipeline={cardsPipeline}
        setCardsPipeline={setCardsPipeline}
      />
      {!parentScrollRef ? (
        <ScrollContainer
          className={`grow h-full overflow-y-scroll scrollbar-hiden flex flex-col relative w-full`}
          innerRef={scrollRef}
        >
          <CollectionContent
            parentScrollRef={scrollRef}
            cardsPipeline={deferedCardsPipeline}
            filterDeck={filterDeck}
          />
        </ScrollContainer>
      ) : (
        <div className="flex flex-col relative w-full">
          <CollectionContent
            parentScrollRef={parentScrollRef}
            cardsPipeline={deferedCardsPipeline}
            filterDeck={filterDeck}
          />
        </div>
      )}
    </div>
  );
}

export interface CardsPipeline {
  filters: ActiveFilters;
  sort: CardSorts;
  isAscending: boolean;
}

function useCollectionFilteredAllCards({
  filterDeck,
  cardsPipeline,
}: {
  filterDeck?: boolean;
  cardsPipeline: CardsPipeline;
}) {
  const { collection, deck } = usePlayerStore((state) => ({
    collection: state.collection,
    deck: state.deck,
  }));
  const allCards = useMemo(() => {
    const currentFilter = cardsPipeline.filters;
    const currentSort = cardsPipeline.sort;
    const isAscending = cardsPipeline.isAscending;

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
  }, [cardsPipeline, collection, deck, filterDeck]);

  return {
    allCards,
  };
}

function CollectionContent({
  parentScrollRef,
  cardsPipeline,
  filterDeck,
}: {
  parentScrollRef: React.RefObject<HTMLDivElement>;
  cardsPipeline: CardsPipeline;
  filterDeck?: boolean;
}) {
  const { allCards } = useCollectionFilteredAllCards({
    filterDeck,
    cardsPipeline,
  });
  const cardListRef = useRef<HTMLDivElement>(null);
  const { firstElementToShow, lastElementToShow } = useCollectionCardsRevealed({
    scrollRef: parentScrollRef,
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

  return (
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
}

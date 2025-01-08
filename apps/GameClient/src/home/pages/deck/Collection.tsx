import { useDeferredValue, useMemo, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, defaultFilters } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { getCardsFiltered } from "./getCardsFiltered";
import { SortAndFilterBox } from "./SortAndFilterBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { DisablableDeckCardUI } from "./DisablableDeckCardUI";
import { DeckCardUI } from "./DeckCardUI";
import { CARD_GAP } from "./CollectionInterface";

interface CollectionProps {
  parentScrollRef?: React.RefObject<HTMLDivElement>;
  filterDeck?: boolean;
  size: number;
}

export default function Collection({
  parentScrollRef,
  filterDeck,
  size,
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
      {!parentScrollRef ? (
        <ScrollContainer
          className={`grow overflow-y-scroll flex flex-col relative`}
          innerRef={scrollRef}
        >
          <CollectionContent
            parentScrollRef={scrollRef}
            cardsPipeline={deferedCardsPipeline}
            setCardsPipeline={setCardsPipeline}
            filterDeck={filterDeck}
            size={size}
          />
        </ScrollContainer>
      ) : (
        <div className="flex flex-col relative w-full">
          <CollectionContent
            parentScrollRef={parentScrollRef}
            cardsPipeline={deferedCardsPipeline}
            setCardsPipeline={setCardsPipeline}
            filterDeck={filterDeck}
            size={size}
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
  setCardsPipeline,
  filterDeck,
  size,
}: {
  parentScrollRef: React.RefObject<HTMLDivElement>;
  cardsPipeline: CardsPipeline;
  setCardsPipeline: React.Dispatch<React.SetStateAction<CardsPipeline>>;
  filterDeck?: boolean;
  size: number;
}) {
  const { allCards } = useCollectionFilteredAllCards({
    filterDeck,
    cardsPipeline,
  });
  const cardListRef = useRef<HTMLDivElement>(null);
  return (
    <div className="absolute top-0 left-0 flex justify-center w-full">
      <div className="grid gap-6 pt-6 pb-16">
        <SortAndFilterBox
          cardsPipeline={cardsPipeline}
          setCardsPipeline={setCardsPipeline}
        />
        <div
          className="w-fit grid grid-cols-4"
          style={{ gap: CARD_GAP * size }}
          ref={cardListRef}
        >
          {allCards.map((card) => (
            <DisablableDeckCardUI
              key={card.id}
              parentScrollRef={parentScrollRef}
              size={size}
            >
              <DeckCardUI card={card} size={size} parentScrollRef={parentScrollRef} />
            </DisablableDeckCardUI>
          ))}
        </div>
      </div>
    </div>
  );
}

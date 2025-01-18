import { useDeferredValue, useMemo, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { getCardsFiltered } from "./getCardsFiltered";
import { SortAndFilterBox } from "./SortAndFilterBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { DisablableDeckCardUI } from "./DisablableDeckCardUI";
import { CollectionCardUI } from "./deckCardUi/DeckCardUI";
import { CARD_GAP, CARDS_BY_ROWS } from "./CollectionInterface";
import { collectionSortFilterService } from "@/services/inject";
import { CARD_BORDER_WIDTH, useOnUnMount } from "@repo/ui";

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
  const cardsPipeline = collectionSortFilterService.useWatch();
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
            filterDeck={filterDeck}
            size={size}
          />
        </ScrollContainer>
      ) : (
        <div className="flex flex-col relative w-full">
          <CollectionContent
            parentScrollRef={parentScrollRef}
            cardsPipeline={deferedCardsPipeline}
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
  let hasBeenFiltered = false;
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
    hasBeenFiltered = detailledCollection.length !== filteredCollection.length;
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
    hasBeenFiltered,
  };
}

function CollectionContent({
  parentScrollRef,
  cardsPipeline,
  filterDeck,
  size,
}: {
  parentScrollRef: React.RefObject<HTMLDivElement>;
  cardsPipeline: CardsPipeline;
  filterDeck?: boolean;
  size: number;
}) {
  const { allCards, hasBeenFiltered } = useCollectionFilteredAllCards({
    filterDeck,
    cardsPipeline,
  });
  const cardListRef = useRef<HTMLDivElement>(null);
  useOnUnMount(() => {
    collectionSortFilterService.clearFilters();
  });
  const gapSize = CARD_GAP * size;
  return (
    <div className="absolute top-0 left-0 flex justify-center w-full">
      <div className="grid gap-6 pt-6 pb-16" style={{ minWidth: CARD_BORDER_WIDTH * size * CARDS_BY_ROWS + (CARDS_BY_ROWS - 1) * gapSize}}>
        <SortAndFilterBox hasBeenFiltered={hasBeenFiltered} />
        <div
          className="w-fit grid grid-cols-4"
          style={{ gap: gapSize }}
          ref={cardListRef}
        >
          {allCards.map((card) => (
            <DisablableDeckCardUI
              key={card.id}
              parentScrollRef={parentScrollRef}
              size={size}
            >
              <CollectionCardUI
                card={card}
                size={size}
                parentScrollRef={parentScrollRef}
              />
            </DisablableDeckCardUI>
          ))}
        </div>
      </div>
    </div>
  );
}

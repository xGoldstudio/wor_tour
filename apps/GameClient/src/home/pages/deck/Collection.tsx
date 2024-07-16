import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import { ActiveFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { SortAndFilterBox } from "./SortAndFilterBox";
import { CardType } from "@repo/ui";

interface filterByRarityProps {
  detailledCollection: (CardType & {
    isInDeck: boolean;
  })[];
  currentFilter: ActiveFilters;
}

function filterByRarity({
  detailledCollection,
  currentFilter,
}: filterByRarityProps) {
  const commonFilter = currentFilter.Common
    ? FiltersDescription["Common"].filterFunction(
        detailledCollection,
        currentFilter.Common
      )
    : null;
  const rareFilter = currentFilter.Rare
    ? FiltersDescription["Rare"].filterFunction(
        detailledCollection,
        currentFilter.Rare
      )
    : null;
  const epicFilter = currentFilter.Epic
    ? FiltersDescription["Epic"].filterFunction(
        detailledCollection,
        currentFilter.Epic
      )
    : null;
  const legendaryFilter = currentFilter.Legendary
    ? FiltersDescription["Legendary"].filterFunction(
        detailledCollection,
        currentFilter.Legendary
      )
    : null;
  const tmpFilter = [commonFilter, rareFilter, epicFilter, legendaryFilter]
    .filter((filter) => filter !== null)
    .flatMap((filter) => filter);
  if (tmpFilter.length !== 0) {
    detailledCollection = detailledCollection.filter((card) =>
      tmpFilter.includes(card)
    );
  }
  detailledCollection = FiltersDescription.Level.filterFunction(
    detailledCollection,
    currentFilter.Level
  );
  detailledCollection = FiltersDescription.Cost.filterFunction(
    detailledCollection,
    currentFilter.Cost
  );

  return detailledCollection;
}

export default function Collection() {
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

  detailledCollection = filterByRarity({ detailledCollection, currentFilter });
  detailledCollection = sorts[currentSort].sortFunction(
    detailledCollection,
    isAscending
  );
  cardNotFound = filterByRarity({
    detailledCollection: cardNotFound,
    currentFilter,
  });
  cardNotFound = sorts[currentSort].sortFunction(cardNotFound, isAscending);
  detailledCollection.push(...cardNotFound);
  return (
    <div className="flex flex-col h-[674px] w-[650px]">
      <div className="grid grid-rows-[1fr_auto] top-0 ">
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
              <DeckCardUI cardId={card.id} />
            </div>
          ))}
          {cardNotFound.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCardUI cardId={card.id} locked={true} unaddble={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

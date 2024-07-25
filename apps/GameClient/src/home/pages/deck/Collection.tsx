import usePlayerStore from "@/home/store/playerStore/playerStore";
import { useState } from "react";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { DeckCardUI } from "./DeckCardUI";
import { SortAndFilterBox } from "./SortAndFilterBox";

export default function Collection() {
  let { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(state.getCollection()),
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

  const collectionLength = detailledCollection.length;

  for (const filter in FiltersDescription) {
    const typedFilter = FiltersDescription[filter as CardFilters];
    detailledCollection = detailledCollection.filter((card) =>
      typedFilter
        .filterFunction(
          detailledCollection,
          currentFilter[filter as CardFilters]
        )
        .includes(card)
    );
  }

  detailledCollection = sorts[currentSort].sortFunction(
    detailledCollection,
    isAscending
  );
  return (
    <div className="w-[650px] h-[674px] grid grid-rows-[1fr_auto] top-0 ">
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
      </div>
    </div>
  );
}

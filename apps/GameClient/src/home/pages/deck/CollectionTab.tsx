import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, defaultSort, sorts } from "./cardSorts";
import { SortAndFilterBox } from "./SortAndFilterBox";
import Collection from "./Collection";

export default function CollectionTab() {
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
    <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
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
        <Collection detailledCollection={detailledCollection} />
      </div>
    </ScrollContainer>
  );
}

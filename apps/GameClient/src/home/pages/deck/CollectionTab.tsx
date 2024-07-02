import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { CardUI } from "./CardUI";
import { SortAndFilter } from "./SortAndFilter";

export default function CollectionTab() {
  const { collection } = usePlayerStore((state) => ({
    collection: state.getCollection(),
  }));
  let { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }));
  const defaultSort: CardSorts = "cost";
  const [currentSort, setcurrentSort] = useState<CardSorts>(defaultSort);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [currentSortNumber, setcurrentSortNumber] = useState<number>(0);

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
      <div className="w-[650px] h-[650px] grid grid-rows-[1fr_auto] top-0 ">
        <SortAndFilter
          currentSort={currentSort}
          setCurrentSort={setcurrentSort}
          isAscending={isAscending}
          setIsAscending={setIsAscending}
          currentSortNumber={currentSortNumber}
          setCurrentSortNumber={setcurrentSortNumber}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />
        <div className="grid grid-cols-4 gap-y-8 pt-4">
          {detailledCollection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <CardUI cardId={card.id} />
            </div>
          ))}
        </div>
      </div>
    </ScrollContainer>
  );
}

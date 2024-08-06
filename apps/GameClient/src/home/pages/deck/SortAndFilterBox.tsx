import useDataStore from "@/cards/DataStore";
import { findValueInRecordByKey } from "../../ui/utils/findValueInRecordByKey";
import { ActiveFilters } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { FilterBox } from "./FilterBox";
import { OrderBox } from "./OrderBox";
import { SortBox } from "./SortBox";

interface SortAndFilterProps {
  collectionLength: number;
  currentSort: CardSorts;
  setCurrentSort: (sort: CardSorts) => void;
  isAscending: boolean;
  setIsAscending: (isAscending: boolean) => void;
  currentFilter: ActiveFilters;
  setCurrentFilter: (filter: ActiveFilters) => void;
}

export function SortAndFilterBox({
  collectionLength,
  currentSort,
  setCurrentSort,
  isAscending,
  setIsAscending,
  currentFilter,
  setCurrentFilter,
}: SortAndFilterProps) {
  const { totalCards } = useDataStore((state) => ({
    totalCards: state.cards.length,
  }));
  return (
    <div className="px-4">
      <div className="h-16 bg-black bg-opacity-30 mt-4 rounded-lg flex items-center px-4 justify-between">
        <div className="">
          Cards Found : {collectionLength} / {totalCards}
        </div>
        <div className="flex flex-row space-x-4 relative">
          <FilterBox
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
          <OrderBox isAscending={isAscending} setIsAscending={setIsAscending} />{" "}
          <SortBox setCurrentSort={setCurrentSort} currentSort={currentSort}>
            {findValueInRecordByKey(sorts, currentSort)?.label}
          </SortBox>
        </div>
      </div>
    </div>
  );
}

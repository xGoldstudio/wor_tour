import useDataStore from "@/cards/DataStore";
import { FilterBox } from "./FilterBox";
import { OrderBox } from "./OrderBox";
import { SortBox } from "./SortBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { CardsPipeline } from "./Collection";
import { ActiveFilters } from "./cardFilters";

interface SortAndFilterProps {
  cardsPipeline: CardsPipeline;
  setCardsPipeline: React.Dispatch<React.SetStateAction<CardsPipeline>>;
}

export function SortAndFilterBox({
  cardsPipeline,
  setCardsPipeline,
}: SortAndFilterProps) {
  const { ownedCardsAmount } = usePlayerStore((state) => ({
    ownedCardsAmount: state.collection.size,
  }));
  const { totalCards } = useDataStore((state) => ({
    totalCards: state.cards.length,
  }));
  return (
    <div className="px-4">
      <div className="h-16 bg-black bg-opacity-30 mt-4 rounded-lg flex items-center px-4 justify-between">
        <div>
          Cards Found : {ownedCardsAmount} / {totalCards}
        </div>
        <div className="flex flex-row space-x-4 relative">
          <FilterBox
            setCurrentFilter={(filters: ActiveFilters) =>
              setCardsPipeline({
                ...cardsPipeline,
                filters,
              })
            }
            currentFilter={cardsPipeline.filters}
          />
          <OrderBox
            isAscending={cardsPipeline.isAscending}
            toggleIsAscending={() =>
              setCardsPipeline((cardsPipeline) => ({
                ...cardsPipeline,
                isAscending: !cardsPipeline.isAscending,
              }))
            }
          />{" "}
          <SortBox
            setCurrentSort={(sort) =>
              setCardsPipeline({
                ...cardsPipeline,
                sort,
              })
            }
            currentSort={cardsPipeline.sort}
          />
        </div>
      </div>
    </div>
  );
}

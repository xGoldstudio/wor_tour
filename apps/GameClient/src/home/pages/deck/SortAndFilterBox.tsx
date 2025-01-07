import useDataStore from "@/cards/DataStore";
import { FilterBox } from "./FilterBox";
import { OrderBox } from "./OrderBox";
import { SortBox } from "./SortBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { CardsPipeline } from "./Collection";
import { ActiveFilters } from "./cardFilters";
import { StatBox } from "./DeckTab";

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
    <StatBox className="py-2">
      <div className="flex w-full justify-between items-center">
        <div>
          <p>Card Collection</p>
          <p className="text-xs text-slate-300">
            Found : {ownedCardsAmount} / {totalCards}
          </p>
        </div>
        <div className="flex flex-row space-x-3 relative">
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
          />
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
    </StatBox>
  );
}

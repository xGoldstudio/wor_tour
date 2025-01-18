import useDataStore from "@/cards/DataStore";
import { FilterBox } from "./FilterBox";
import { OrderBox } from "./OrderBox";
import { SortBox } from "./SortBox";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { StatBox } from "./DeckTab";


export function SortAndFilterBox({ hasBeenFiltered }: { hasBeenFiltered: boolean }) {
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
          <FilterBox hasBeenFiltered={hasBeenFiltered} />
          <OrderBox />
          <SortBox />
        </div>
      </div>
    </StatBox>
  );
}

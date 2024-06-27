import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { CardUI } from "./CardUI";

export default function CollectionTab() {
  const { collection } = usePlayerStore((state) => ({
    collection: state.getCollection(),
  }));
  let { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }));
  const defaultSort: CardSorts = "cost_asc";
  const [actualSort, setActualSort] = useState<CardSorts>(defaultSort);
  const [actualFilter, setActualFilter] = useState<ActiveFilters>({
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
          actualFilter[filter as CardFilters]
        )
        .includes(card)
    );
  }
  detailledCollection = sorts[actualSort].sortFunction(detailledCollection);
  return (
    <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
      <div className="w-[650px] grid grid-rows-[1fr_auto] top-0 h-full">
        <div className="grid grid-cols-4 gap-y-8 pt-8">
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

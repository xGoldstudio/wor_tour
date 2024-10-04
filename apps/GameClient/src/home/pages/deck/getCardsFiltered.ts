import { CardType } from "game_engine";
import { ActiveFilters, FiltersDescription } from "./cardFilters";

interface getCardsFilteredProps {
  detailledCollection: (CardType & {
    isInDeck: boolean;
  })[];
  currentFilter: ActiveFilters;
}

export function getCardsFiltered({
  detailledCollection,
  currentFilter,
}: getCardsFilteredProps) {
  const commonFilter = FiltersDescription["Common"].filterFunction(
    detailledCollection,
    currentFilter.Common
  );
  const rareFilter = FiltersDescription["Rare"].filterFunction(
    detailledCollection,
    currentFilter.Rare
  );
  const epicFilter = FiltersDescription["Epic"].filterFunction(
    detailledCollection,
    currentFilter.Epic
  );
  const legendaryFilter = FiltersDescription["Legendary"].filterFunction(
    detailledCollection,
    currentFilter.Legendary
  );
  const tmpFilter = [commonFilter, rareFilter, epicFilter, legendaryFilter]
    .filter((filter) => filter !== null)
    .flatMap((filter) => filter);
  if (tmpFilter.length !== 0) {
    detailledCollection = detailledCollection.filter((card) =>
      tmpFilter.includes(card)
    );
  }
  detailledCollection =
    FiltersDescription.Level.filterFunction(
      detailledCollection,
      currentFilter.Level
    ) || [];
  detailledCollection =
    FiltersDescription.Cost.filterFunction(
      detailledCollection,
      currentFilter.Cost
    ) || [];

  return detailledCollection;
}

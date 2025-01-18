import { CardType } from "game_engine";

export type PlayerCardCollectionInfo = CardType & { isInDeck: boolean, lockLabel: string | null };
export type Filters = {
  "Common": CardFilter;
  "Rare": CardFilter;
  "Epic": CardFilter;
  "Legendary": CardFilter;
  "Cost": RangeCardFilter;
  "Level": RangeCardFilter;
};
export type CardFiltersByRarity = "Common" | "Rare" | "Epic" | "Legendary";
export type CardFilters =
  | "Cost"
  | "Common"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Level";
export type CardFiltersRange = "Cost" | "Level";
export type CardFilterState = boolean | { min: number; max: number };
export interface CardFilter {
  label: CardFilters;
  isButton: boolean;
  filterFunction: (
    cards: PlayerCardCollectionInfo[],
    state: CardFilterState,
  ) => PlayerCardCollectionInfo[] | null;
}
export interface RangeCardFilter extends CardFilter {
  label: CardFiltersRange;
  isButton: false;
  rangeMin: number;
  rangeMax: number;
}
export type ActiveFilters = Record<CardFilters, CardFilterState>;
export interface FilterSliderProperties {
  handle: {
    backgroundImage: string;
    background: string;
    borderColor: string;
    boxShadow: string;
  };
  track: {
    background: string;
  };
}
export type FilterSliderStyles = Record<
  CardFiltersRange,
  FilterSliderProperties
>;
export const FiltersDescription: Filters = {
  Common: {
    label: "Common",
    isButton: true,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      state === false ? null : cards.filter((card) => card.rarity === "common"),
  },
  Rare: {
    label: "Rare",
    isButton: true,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      state === false ? null : cards.filter((card) => card.rarity === "rare"),
  },
  Epic: {
    label: "Epic",
    isButton: true,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      state === false ? null : cards.filter((card) => card.rarity === "epic"),
  },
  Legendary: {
    label: "Legendary",
    isButton: true,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      state === false
        ? null
        : cards.filter((card) => card.rarity === "legendary"),
  },
  Cost: {
    label: "Cost",
    rangeMin: 1,
    rangeMax: 9,
    isButton: false,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      typeof state === "object" && typeof state.min === "number"
        ? cards.filter(
          (card) => card.cost >= state.min && card.cost <= state.max
        )
        : cards,
  },
  Level: {
    label: "Level",
    rangeMin: 1,
    rangeMax: 3,
    isButton: false,
    filterFunction: (cards: PlayerCardCollectionInfo[], state: CardFilterState) =>
      typeof state === "object" && typeof state.min === "number"
        ? cards.filter(
          (card) => card.level >= state.min && card.level <= state.max
        )
        : cards,
  },
};

export const CardFilterSliderStyles: FilterSliderStyles = {
  Cost: {
    handle: {
      backgroundImage:
        "linear-gradient(60deg, rgba(136,21,127,1) 0%, rgba(212,100,203,1) 100%)",
      background:
        "radial-gradient(at 95% 15%,#DCA9D8, rgba(184,121,179,1) 22%,#9f3897 45%, rgba(184,121,179,1) 68%, rgba(207,137,201,1) 100%)",
      borderColor: "rgba(184,121,179,1)",
      boxShadow: "none",
    },
    track: {
      background:
        "linear-gradient(0deg, rgba(136,21,127,1) 0%, rgba(212,100,203,1) 100%)",
    },
  },
  Level: {
    handle: {
      backgroundImage: "linear-gradient(60deg, #B90015 0%, #FF5A5F 100%)",
      background: "radial-gradient(at 95% 15%, #B90015 0%, #FF5A5F 100%)",
      borderColor: "#FF6F7D",
      boxShadow: "none",
    },
    track: {
      background:
        "linear-gradient(0deg, #B90015 0%, #FF5A5F 100%)",
    },
  },
};
export const defaultFilters = {
  Cost: {
    min: FiltersDescription.Cost.rangeMin,
    max: FiltersDescription.Cost.rangeMax,
  },
  Common: false,
  Rare: false,
  Epic: false,
  Legendary: false,
  Level: {
    min: FiltersDescription.Level.rangeMin,
    max: FiltersDescription.Level.rangeMax,
  },
}
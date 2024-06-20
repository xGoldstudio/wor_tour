import { CardType } from "@repo/ui";

export type Card = CardType & { isInDeck: boolean };
export type Filters = Record<CardFilters, CardFilter>;
export type CardFilters =
  | "Cost"
  | "Common"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Level";
export type CardFilterState = boolean | { min: number; max: number };
export interface CardFilter {
  label: CardFilters;
  style?: string;
  rangeMin?: number;
  rangeMax?: number;
  isButton: boolean;
  filterFunction: (cards: Card[], state: CardFilterState) => Card[];
}
export type ActiveFilters = Record<CardFilters, CardFilterState>;

export const FiltersDescription: Filters = {
  Common: {
    label: "Common",
    style: "bronze.avif",
    isButton: true,
    filterFunction: (cards: Card[], state: CardFilterState) =>
      state === false
        ? cards
        : cards.filter((card) => card.rarity === "common"),
  },
  Rare: {
    label: "Rare",
    style: "silver.jpeg",
    isButton: true,
    filterFunction: (cards, state) =>
      state === false ? cards : cards.filter((card) => card.rarity === "rare"),
  },
  Epic: {
    label: "Epic",
    style: "gold.jpeg",
    isButton: true,
    filterFunction: (cards, state) =>
      state === false ? cards : cards.filter((card) => card.rarity === "epic"),
  },
  Legendary: {
    label: "Legendary",
    style: "diamond.avif",
    isButton: true,
    filterFunction: (cards, state) =>
      state === false
        ? cards
        : cards.filter((card) => card.rarity === "legendary"),
  },
  Cost: {
    label: "Cost",
    rangeMin: 1,
    rangeMax: 9,
    isButton: false,
    filterFunction: (cards, state) =>
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
    filterFunction: (cards, state) =>
      typeof state === "object" && typeof state.min === "number"
        ? cards.filter(
            (card) => card.level >= state.min && card.level <= state.max
          )
        : cards,
  },
};

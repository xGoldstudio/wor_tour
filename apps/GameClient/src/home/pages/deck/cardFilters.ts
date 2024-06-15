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
export interface CardFilter {
  label?: string;
  style?: string;
  rangeMin?: number;
  rangeMax?: number;
  filterFunction: (card: Card[]) => Card[];
}
export type ActiveFilters = Record<CardFilters, boolean>;

export const filters: Filters = {
  Cost: {
    label: "Cost",
    rangeMin: 1,
    rangeMax: 3,
    filterFunction: (card) =>
      card.filter(
        (card) =>
          card.cost >= filters.Cost.rangeMin! &&
          card.cost <= filters.Cost.rangeMax!
      ),
  },
  Common: {
    label: "Common",
    style: "bronze.avif",
    filterFunction: (card) => card.filter((card) => card.rarity === "common"),
  },
  Rare: {
    label: "Rare",
    style: "silver.jpeg",
    filterFunction: (card) => card.filter((card) => card.rarity === "rare"),
  },
  Epic: {
    label: "Epic",
    style: "gold.jpeg",
    filterFunction: (card) => card.filter((card) => card.rarity === "epic"),
  },
  Legendary: {
    label: "Legendary",
    style: "diamond.avif",
    filterFunction: (card) =>
      card.filter((card) => card.rarity === "legendary"),
  },
  Level: {
    label: "Level",
    rangeMin: 1,
    rangeMax: 3,
    filterFunction: (card) =>
      card.filter(
        (card) =>
          card.level >= filters.Level.rangeMin! &&
          card.level <= filters.Level.rangeMax!
      ),
  },
};

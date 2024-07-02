import { findCard } from "@/cards";
import { Card } from "./cardFilters";

export type Sorts = Record<CardSorts, CardSort>;
export type CardSorts = "cost" | "rarity" | "world" | "level";
export interface CardSort {
  label: string;
  sortFunction: (detailledCollection: Card[], isAcending: boolean) => Card[];
}

const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };

export const sorts: Sorts = {
  cost: {
    label: "Cost",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort(
        isAscending
          ? (a, b) =>
              findCard(a.id, a.level).cost - findCard(b.id, b.level).cost
          : (a, b) =>
              findCard(b.id, b.level).cost - findCard(a.id, a.level).cost
      ),
  },
  rarity: {
    label: "Rarity",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort(
        isAscending
          ? (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
          : (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
      ),
  },
  world: {
    label: "World",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort((a, b) =>
        isAscending ? a.world - b.world : b.world - a.world
      ),
  },
  level: {
    label: "Level",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort((a, b) =>
        isAscending ? a.level - b.level : b.level - a.level
      ),
  },
};
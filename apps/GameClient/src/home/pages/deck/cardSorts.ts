import { findCard } from "@/cards";
import { CardCollection } from "./cardFilters";

export const NUMBER_OF_CARD_IN_DECK: number = 8;

export type Sorts = Record<CardSorts, CardSort>;
export type CardSorts = "cost" | "rarity" | "world" | "level";
export interface CardSort {
  label: string;
  sortFunction: (
    detailledCollection: CardCollection[],
    isAcending: boolean
  ) => CardCollection[];
}
export const defaultSort: CardSorts = "world";

const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };

export const sorts: Sorts = {
  cost: {
    label: "By Cost",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort((a, b) =>
        isAscending
          ? findCard(a.id, a.level).cost - findCard(b.id, b.level).cost
          : findCard(b.id, b.level).cost - findCard(a.id, a.level).cost
      ),
  },
  rarity: {
    label: "By Rarity",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort(
        isAscending
          ? (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
          : (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
      ),
  },
  world: {
    label: "By World",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort((a, b) =>
        isAscending ? a.world - b.world : b.world - a.world
      ),
  },
  level: {
    label: "By Level",
    sortFunction: (detailledCollection, isAscending) =>
      detailledCollection.sort((a, b) =>
        isAscending ? a.level - b.level : b.level - a.level
      ),
  },
};

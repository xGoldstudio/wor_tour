import { findCard } from "@/cards";
import { Card } from "./cardFilters";

export type Sorts = Record<CardSorts, CardSort>;
export type CardSorts =
  | "Cost↑"
  | "Cost↓"
  | "Rarity↑"
  | "Rarity↓"
  | "World↑"
  | "World↓";
export interface CardSort {
  label: string;
  sortFunction: (detailledCollection: Card[]) => Card[];
}

const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };

export const sorts: Sorts = {
  "Cost↑": {
    label: "Cost ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => findCard(a.id, a.level).cost - findCard(b.id, b.level).cost
      ),
  },
  "Cost↓": {
    label: "Cost ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => findCard(b.id, b.level).cost - findCard(a.id, a.level).cost
      ),
  },
  "Rarity↑": {
    label: "Rarity ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
      ),
  },
  "Rarity↓": {
    label: "Rarity ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
      ),
  },
  "World↑": {
    label: "World ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort((a, b) => a.world - b.world),
  },
  "World↓": {
    label: "World ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort((a, b) => b.world - a.world),
  },
};

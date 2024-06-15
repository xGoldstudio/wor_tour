import { findCard } from "@/cards";
import { Card } from "./cardFilters";

export type Sorts = Record<CardSorts, CardSort>;
export type CardSorts =
  | "cost_asc"
  | "cost_desc"
  | "rarity_asc"
  | "rarity_desc"
  | "world_asc"
  | "world_desc";
export interface CardSort {
  label: string;
  sortFunction: (detailledCollection: Card[]) => Card[];
}

const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };

export const sorts: Sorts = {
  cost_asc: {
    label: "Cost ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => findCard(a.id, a.level).cost - findCard(b.id, b.level).cost
      ),
  },
  cost_desc: {
    label: "Cost ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => findCard(b.id, b.level).cost - findCard(a.id, a.level).cost
      ),
  },
  rarity_asc: {
    label: "Rarity ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
      ),
  },
  rarity_desc: {
    label: "Rarity ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort(
        (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
      ),
  },
  world_asc: {
    label: "World ↑",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort((a, b) => a.world - b.world),
  },
  world_desc: {
    label: "World ↓",
    sortFunction: (detailledCollection) =>
      detailledCollection.sort((a, b) => b.world - a.world),
  },
};

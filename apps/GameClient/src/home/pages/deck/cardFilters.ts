import { CardType } from "@repo/ui";
import React from "react";
import { string } from "three/examples/jsm/nodes/Nodes.js";

export type Card = CardType & { isInDeck: boolean };
export type Filters = Record<CardFilters, CardFilter>;
export type CardFilters =
  | "Cost"
  | "Common"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Level";
export type CardFiltersStyles = "Cost" | "Level";
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
export interface FilterSliderProperties {
  handle: {
    backgroundImage: string;
    background: string;
    borderColor: string;
    boxShadow: string;
  };
  track: {
    backgroundColor: string;
    backgroundImage: string;
    background: string;
  };
}
export type FilterSliderStyles = Record<
  CardFiltersStyles,
  FilterSliderProperties
>;
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
      backgroundColor:
        "radial-gradient(at 95% 15%,#DCA9D8, rgba(184,121,179,1) 22%,#9f3897 45%, rgba(184,121,179,1) 68%, rgba(207,137,201,1) 100%)",
      backgroundImage:
        "linear-gradient(60deg, rgba(136,21,127,1) 0%, rgba(212,100,203,1) 100%)",
      background:
        "radial-gradient(at 95% 15%,#DCA9D8, rgba(184,121,179,1) 22%,#9f3897 45%, rgba(184,121,179,1) 68%, rgba(207,137,201,1) 100%)",
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
      backgroundColor: "#B90015",
      backgroundImage: "linear-gradient(60deg, #B90015 0%, #FF5A5F 100%)",
      background: "radial-gradient(at 95% 15%, #B90015 0%, #FF5A5F 100%)",
    },
  },
};

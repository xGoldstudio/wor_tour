import { CardRarity } from "../types/DataStoreType";

export default function textureByRarity(rarity: CardRarity) {
  const borderTextureRarity = {
    common: "bronze.avif",
    rare: "silver.jpeg",
    epic: "gold.jpeg",
    legendary: "diamond.avif",
  };
  return borderTextureRarity[rarity];
}

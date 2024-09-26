import { getImageUrl, TEXTURE } from '@repo/lib';
import { CardRarity } from "../../gameEngine/src/types/DataStoreType";

export default function textureByRarity(rarity: CardRarity) {
  const borderTextureRarity = {
    common: "bronze.avif",
    rare: "silver.jpeg",
    epic: "gold.jpeg",
    legendary: "diamond.avif",
  };
  return getImageUrl(TEXTURE, borderTextureRarity[rarity]);
}

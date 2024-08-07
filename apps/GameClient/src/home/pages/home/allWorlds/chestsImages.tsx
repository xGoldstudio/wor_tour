import { CHEST, getImageUrl } from "@repo/lib";

export const glowChestImageByLevel = {
  common: getImageUrl(CHEST, "common_yellow_glow.png"),
  rare: getImageUrl(CHEST, "rare_yellow_glow.png"),
  epic: getImageUrl(CHEST, "mythical_yellow_glow.png"),
};

export const chestImageByLevel = {
  common: getImageUrl(CHEST, "common_no_glow.png"),
  rare: getImageUrl(CHEST, "rare_no_glow.png"),
  epic: getImageUrl(CHEST, "mythical_no_glow.png"),
};

export const emptyChestImageByLevel = {
  common: getImageUrl(CHEST, "common_empty_no_glow.png"),
  rare: getImageUrl(CHEST, "rare_empty_no_glow.png"),
  epic: getImageUrl(CHEST, "mythical_empty_no_glow.png"),
};
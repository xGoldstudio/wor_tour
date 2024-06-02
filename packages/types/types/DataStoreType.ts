export interface EditorData {
  cards: CardStat[];
  worlds: World[];
}

export interface World {
  id: number;
  illustration: string | null;
  cardBackground: string | null;
  name: string;
  description: string;
  levels: Level[];
}

export interface Level {
  id: number;
  world: 1;
  reward: {
    gold: number;
    xp: number;
  };
  strength: number;
}

export interface CardStat {
  name: string;
  rarity: CardRarity;
  id: number;
  world: number;
  attackDefenseRatio: number; // ]0,1[
  speedDamageRatio: number; // ]0,1[
  stats: [CardStatLevel, CardStatLevel, CardStatLevel];
}

export interface CardStatLevel {
  cost: number;
  effects: CardEffects;
  illustration: string | null;
}

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export interface CardEffects {
  multiAttack?: MultiAttackEffect;
  placementHeal?: PlacementHeal;
  fightBack?: FightBackEffect;
}

interface MultiAttackEffect {
  type: "multiAttack";
}

interface PlacementHeal {
  type: "placementHeal";
  amount: number;
}

interface FightBackEffect {
  type: "fightBack";
}
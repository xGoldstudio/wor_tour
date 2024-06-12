export interface EditorData {
  cards: CardStat[];
  worlds: WorldStats[];
}

export interface WorldStats {
  id: number;
  illustration: string | null;
  cardBackground: string | null;
  name: string;
  description: string;
}

export interface Level {
  id: number;
  world: number;
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
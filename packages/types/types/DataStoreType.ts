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

export interface BoosterTypeDeclartion {
	name: string;
	cost: number;
	description: string;
	purchaseDelayInMs?: number;
	unlockCondition: {
		world: number;
	};
	contain: {
		worlds: number[];
		rarities: Record<CardRarity, number>;
		unitAmount: number;
	};
}

export interface Level {
  strength: number,
  world: number,
  level: number,
  id: number,
	chest: "common" | "rare" | "epic",
  trophyStart: number,
  trophyEnd: number,
  reward: {
    gold: number,
    xp: number,
    booster: BoosterTypeDeclartion | null,
  }
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
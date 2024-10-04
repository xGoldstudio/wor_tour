import { Level } from "game_engine";

export interface Tier {
  tier: number;
	level: Level;
  isUnlocked: boolean;
  isOpen: boolean;
	isWorld: boolean;
	world: number;
}

export function getTierFromLevel(level: Level): Tier {
	return {
		tier: level.id,
		level,
		isUnlocked: false,
		isOpen: false,
		isWorld: level.level === 1,
		world: level.world,
	};
}

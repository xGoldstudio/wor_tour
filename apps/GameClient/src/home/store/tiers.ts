import _ from 'lodash';

export interface Tier {
  tier: number;
  beginTrophies: number;
  endTrophies: number;
  isUnlocked: boolean;
  isOpen: boolean;
	isWorld: boolean;
	world: number;
}

export const allTiers: Tier[] = _.times(50).map(i => {
	return {
		tier: i,
		beginTrophies: i * 100,
		endTrophies: (i) * 100,
		isUnlocked: false,
		isOpen: false,
		isWorld: i % 10 === 0,
		world: Math.floor(i / 10) + 1,
	};
});

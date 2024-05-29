import { CardStatsInfo } from ".";

const card1: CardStatsInfo = {
	name: "Gentil Crabvor",
	rarity: "common",
	id: 1,
	world: 1,
	stats: [
		{
			cost: 3,
			dmg: 150,
			hp: 300,
			attackSpeed: 0.6,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 150,
				},
			},
		},
		{
			cost: 3,
			dmg: 180,
			hp: 360,
			attackSpeed: 0.72,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 150,
				},
			},
		},
		{
			cost: 3,
			dmg: 185,
			hp: 370,
			attackSpeed: 0.8,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 200,
				},
			},
		},
	]
}
export default card1;
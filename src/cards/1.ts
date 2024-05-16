import { CardStatsInfo } from ".";

const card1: CardStatsInfo = {
	name: "Gentil Crabvor",
	rarity: "rare",
	id: 1,
	world: 1,
	stats: [
		{
			cost: 3,
			dmg: 150,
			hp: 300,
			attackSpeed: 0.3,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 250,
				},
			},
		},
		{
			cost: 3,
			dmg: 150,
			hp: 300,
			attackSpeed: 0.3,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 250,
				},
			},
		},
		{
			cost: 3,
			dmg: 150,
			hp: 300,
			attackSpeed: 0.3,
			effects: {
				placementHeal: {
					type: "placementHeal",
					amount: 250,
				},
			},
		},
	]
}
export default card1;
import { CardStatsInfo } from ".";

const card7: CardStatsInfo = {
	"name": "Médusor",
	"rarity": "common",
	"id": 7,
	"world": 1,
	"stats": [
		{
			"cost": 2,
			"dmg": 150,
			"attackSpeed": 1,
			"hp": 250,
			"effects": {},
		},
		{
			"cost": 1,
			"dmg": 180,
			"attackSpeed": 1.2,
			"hp": 300,
			"effects": {},
		},
		{
			"cost": 1,
			"dmg": 216,
			"attackSpeed": 1.44,
			"hp": 360,
			"effects": {
				"fightBack": { "type": "fightBack" }
			},
		}
	]
}
export default card7;
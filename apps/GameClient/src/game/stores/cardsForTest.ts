import { CardType } from "@repo/lib";

const cardForTest: [number, CardType][] = [
	[
			1,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_1_1717529721890.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 45,
					"hp": 143,
					"attackSpeed": 0.12000000000000002,
					"rarity": "common",
					"id": 1,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Small Bitter",
					"cost": 3,
					"illustration": "card_2_level_1_1717531255144.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 38,
					"hp": 70,
					"attackSpeed": 0.16617174211248284,
					"rarity": "common",
					"id": 2,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Medusor",
					"cost": 3,
					"illustration": "card_3_level_1_1717283332492.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 76,
					"hp": 45,
					"attackSpeed": 0.25599999999999995,
					"rarity": "common",
					"id": 3,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Habitant Of The Claw",
					"cost": 2,
					"illustration": "card_4_level_1_1717531357516.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 19,
					"hp": 98,
					"attackSpeed": 0.26399999999999996,
					"rarity": "common",
					"id": 4,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Crabvor Recruit",
					"cost": 3,
					"illustration": "card_5_level_1_1717532787493.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 43,
					"hp": 36,
					"attackSpeed": 0.48,
					"rarity": "common",
					"id": 5,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Psychalgua Exo Mana",
					"cost": 1,
					"illustration": "card_6_level_1_1717534152341.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 18,
					"hp": 41,
					"attackSpeed": 0.4640000000000001,
					"rarity": "common",
					"id": 6,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Crabvor Preceptor",
					"cost": 5,
					"illustration": "card_7_level_1_1717535727870.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 237,
					"hp": 132,
					"attackSpeed": 0.12000000000000002,
					"rarity": "common",
					"id": 7,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1,
			{
					"name": "Crabvor Elite",
					"cost": 4,
					"illustration": "card_8_level_1_1717546932368.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 57,
					"hp": 182,
					"attackSpeed": 0.15999999999999998,
					"rarity": "common",
					"id": 8,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1.1,
			{
					"name": "Friendly Crabvor",
					"cost": 3,
					"illustration": "card_9_level_1_1719012812863.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 29,
					"hp": 70,
					"attackSpeed": 0.33520389075944623,
					"rarity": "rare",
					"id": 9,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 25
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1.1,
			{
					"name": "Crabvor Mage",
					"cost": 4,
					"illustration": "card_10_level_1_1720023182860.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 309,
					"hp": 97,
					"attackSpeed": 0.07999999999999999,
					"rarity": "rare",
					"id": 10,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1.1,
			{
					"name": "Crabvor Chief",
					"cost": 4,
					"illustration": "card_11_level_1_1717534294464.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 16,
					"hp": 216,
					"attackSpeed": 0.4720000000000001,
					"rarity": "rare",
					"id": 11,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1.1,
			{
					"name": "Primal Crabvor",
					"cost": 6,
					"illustration": "card_12_level_1_1720034721455.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 33,
					"hp": 401,
					"attackSpeed": 0.190322881213427,
					"rarity": "rare",
					"id": 12,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1.2,
			{
					"name": "Gigrabvor",
					"cost": 4,
					"illustration": "card_13_level_1_1719956460438.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 70,
					"hp": 131,
					"attackSpeed": 0.13020478758003382,
					"rarity": "epic",
					"id": 13,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1.2,
			{
					"name": "Hero Crabvor",
					"cost": 2,
					"illustration": "card_14_level_1_1720028759577.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 26,
					"hp": 27,
					"attackSpeed": 0.5824933333333333,
					"rarity": "epic",
					"id": 14,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 10
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1.2,
			{
					"name": "Ragh Hunter",
					"cost": 2,
					"illustration": "card_16_level_1_1720706342299.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 28,
					"hp": 43,
					"attackSpeed": 0.584,
					"rarity": "common",
					"id": 16,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Spadassin",
					"cost": 3,
					"illustration": "card_17_level_1_1720721228258.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 65,
					"hp": 98,
					"attackSpeed": 0.26399999999999996,
					"rarity": "common",
					"id": 17,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Keeper",
					"cost": 5,
					"illustration": "card_18_level_1_1720722631140.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 51,
					"hp": 290,
					"attackSpeed": 0.296,
					"rarity": "common",
					"id": 18,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Raghorse",
					"cost": 1,
					"illustration": "card_19_level_1_1720977947828.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 20,
					"hp": 74,
					"attackSpeed": 0.31200000000000006,
					"rarity": "common",
					"id": 19,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_1_1720975944876.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 21,
					"hp": 60,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 20,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Slave",
					"cost": 1,
					"illustration": "card_21_level_1_1720977466954.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 21,
					"hp": 60,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 21,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Thrower",
					"cost": 3,
					"illustration": "card_22_level_1_1721050271270.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 15,
					"hp": 95,
					"attackSpeed": 0.38489259865578085,
					"rarity": "common",
					"id": 22,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 10
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Fighter",
					"cost": 1,
					"illustration": "card_23_level_1_1721051354517.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 22,
					"hp": 57,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 23,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "Enraged Ragh",
					"cost": 2,
					"illustration": "card_24_level_1_1720724823656.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 44,
					"hp": 53,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 24,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "The Clown",
					"cost": 4,
					"illustration": "card_25_level_1_1720974780704.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 57,
					"hp": 162,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 25,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_1_1721055659853.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 23,
					"hp": 66,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 26,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "Gar The Crusader",
					"cost": 1,
					"illustration": "card_27_level_1_1721057309461.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 23,
					"hp": 66,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 27,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.44,
			{
					"name": "Flying Scorpion",
					"cost": 7,
					"illustration": "card_28_level_1_1720723376133.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 10,
					"hp": 768,
					"attackSpeed": 0.5781893209998842,
					"rarity": "epic",
					"id": 28,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.44,
			{
					"name": "The Purificator",
					"cost": 1,
					"illustration": "card_29_level_1_1721060115017.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 29,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.44,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 31,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 32,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 33,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 34,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 35,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 36,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 37,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 25,
					"hp": 72,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 38,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.5,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_2_1717530044081.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 55,
					"hp": 215,
					"attackSpeed": 0.1469693845669907,
					"rarity": "common",
					"id": 1,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Small Bitter",
					"cost": 3,
					"illustration": "card_2_level_2_1717531258110.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 47,
					"hp": 105,
					"attackSpeed": 0.20214327542154725,
					"rarity": "common",
					"id": 2,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Medusor",
					"cost": 3,
					"illustration": "card_3_level_2_1717283337041.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 73,
					"hp": 42,
					"attackSpeed": 0.2478225171367605,
					"rarity": "common",
					"id": 3,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Habitant Of The Claw",
					"cost": 2,
					"illustration": "card_4_level_2_1717531361979.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 22,
					"hp": 124,
					"attackSpeed": 0.2973244464957737,
					"rarity": "common",
					"id": 4,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Crabvor Recruit",
					"cost": 3,
					"illustration": "card_5_level_2_1717532831361.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 53,
					"hp": 54,
					"attackSpeed": 0.5878775382679626,
					"rarity": "common",
					"id": 5,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Psychalgua Exo Mana",
					"cost": 1,
					"illustration": "card_6_level_2_1717534163302.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 22,
					"hp": 61,
					"attackSpeed": 0.5682816203256974,
					"rarity": "common",
					"id": 6,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Crabvor Preceptor",
					"cost": 5,
					"illustration": "card_7_level_2_1717535731862.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 279,
					"hp": 185,
					"attackSpeed": 0.14162249431263296,
					"rarity": "common",
					"id": 7,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 15
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Crabvor Elite",
					"cost": 4,
					"illustration": "card_8_level_2_1717546935760.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 69,
					"hp": 273,
					"attackSpeed": 0.1959591794226542,
					"rarity": "common",
					"id": 8,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.5,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_1_1720100170687.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 37,
					"hp": 21,
					"attackSpeed": 0.6756568678885756,
					"rarity": "legendary",
					"id": 15,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 5
							}
					],
					"level": 1,
					"world": 1
			}
	],
	[
			1.58,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 28,
					"hp": 79,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 39,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.58,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 28,
					"hp": 79,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 40,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.58,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 28,
					"hp": 79,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 41,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.58,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 28,
					"hp": 79,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 42,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.65,
			{
					"name": "Friendly Crabvor",
					"cost": 3,
					"illustration": "card_9_level_2_1719012817640.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 28,
					"hp": 61,
					"attackSpeed": 0.31356069986527324,
					"rarity": "rare",
					"id": 9,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 75
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.65,
			{
					"name": "Crabvor Mage",
					"cost": 4,
					"illustration": "card_10_level_2_1720024251885.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 378,
					"hp": 146,
					"attackSpeed": 0.0979795897113271,
					"rarity": "rare",
					"id": 10,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.65,
			{
					"name": "Crabvor Chief",
					"cost": 4,
					"illustration": "card_11_level_2_1717534301963.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 20,
					"hp": 324,
					"attackSpeed": 0.5780795792968301,
					"rarity": "rare",
					"id": 11,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.65,
			{
					"name": "Primal Crabvor",
					"cost": 6,
					"illustration": "card_12_level_2_1720034153300.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 41,
					"hp": 613,
					"attackSpeed": 0.23521345580150854,
					"rarity": "rare",
					"id": 12,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.73,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 43,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.73,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 44,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.73,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 46,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 47,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 48,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 49,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 50,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 51,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 52,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.73,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 30,
					"hp": 86,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 53,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.8,
			{
					"name": "Gigrabvor",
					"cost": 4,
					"illustration": "card_13_level_2_1719956464360.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 79,
					"hp": 165,
					"attackSpeed": 0.14657008832382995,
					"rarity": "epic",
					"id": 13,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 2
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.8,
			{
					"name": "Hero Crabvor",
					"cost": 2,
					"illustration": "card_14_level_2_1720027978144.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 32,
					"hp": 38,
					"attackSpeed": 0.6903624691358022,
					"rarity": "epic",
					"id": 14,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 20
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			1.8,
			{
					"name": "Ragh Hunter",
					"cost": 2,
					"illustration": "card_16_level_2_1720706346178.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 35,
					"hp": 65,
					"attackSpeed": 0.7152510048926879,
					"rarity": "common",
					"id": 16,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Ragh Spadassin",
					"cost": 3,
					"illustration": "card_17_level_2_1720721232627.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 79,
					"hp": 147,
					"attackSpeed": 0.32333264604737944,
					"rarity": "common",
					"id": 17,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Ragh Keeper",
					"cost": 5,
					"illustration": "card_18_level_2_1720722634257.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 63,
					"hp": 436,
					"attackSpeed": 0.36252448193191034,
					"rarity": "common",
					"id": 18,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Raghorse",
					"cost": 1,
					"illustration": "card_19_level_2_1720977954509.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 25,
					"hp": 111,
					"attackSpeed": 0.38212039987417584,
					"rarity": "common",
					"id": 19,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_2_1720975947846.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 26,
					"hp": 90,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 20,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Ragh Slave",
					"cost": 1,
					"illustration": "card_21_level_2_1720977471267.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 26,
					"hp": 90,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 21,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Ragh Thrower",
					"cost": 3,
					"illustration": "card_22_level_2_1721050621698.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 15,
					"hp": 106,
					"attackSpeed": 0.4065253467459227,
					"rarity": "common",
					"id": 22,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 20
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "Ragh Fighter",
					"cost": 1,
					"illustration": "card_23_level_2_1721051661386.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 27,
					"hp": 86,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 23,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.8,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_1_1721062011136.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 53,
					"hp": 502,
					"attackSpeed": 0.40303797688808557,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "bleeding",
									"trigger": "onAttack",
									"target": "selfCard",
									"value": 30
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 30
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.9,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 33,
					"hp": 95,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 54,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.9,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 33,
					"hp": 95,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 55,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.9,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 33,
					"hp": 95,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 56,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.9,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 33,
					"hp": 95,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 57,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			1.98,
			{
					"name": "Enraged Ragh",
					"cost": 2,
					"illustration": "card_24_level_2_1720725223340.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 54,
					"hp": 80,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 24,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.98,
			{
					"name": "The Clown",
					"cost": 4,
					"illustration": "card_25_level_2_1720974783343.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 71,
					"hp": 243,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 25,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.98,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_2_1721055653476.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 28,
					"hp": 99,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 26,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.98,
			{
					"name": "Gar The Crusader",
					"cost": 1,
					"illustration": "card_27_level_2_1721057402888.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 28,
					"hp": 99,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 27,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			2.07,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 58,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			2.07,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 59,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			2.07,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 61,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 62,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 63,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 64,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 65,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 66,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 67,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.07,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 103,
					"attackSpeed": 0.4,
					"rarity": "common",
					"id": 68,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.16,
			{
					"name": "Flying Scorpion",
					"cost": 7,
					"illustration": "card_28_level_2_1720723379187.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 12,
					"hp": 1154,
					"attackSpeed": 0.7085946814933275,
					"rarity": "epic",
					"id": 28,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			2.16,
			{
					"name": "The Purificator",
					"cost": 1,
					"illustration": "card_29_level_2_1721059979891.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 29,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			2.16,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 31,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 32,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 33,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 34,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 35,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 36,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 37,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 31,
					"hp": 108,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 38,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 108,
					"attackSpeed": 0.4,
					"rarity": "legendary",
					"id": 45,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			2.25,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_3_1717530116564.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 68,
					"hp": 323,
					"attackSpeed": 0.18000000000000002,
					"rarity": "common",
					"id": 1,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Small Bitter",
					"cost": 3,
					"illustration": "card_2_level_3_1717531263090.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 58,
					"hp": 157,
					"attackSpeed": 0.2479666029760947,
					"rarity": "common",
					"id": 2,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Medusor",
					"cost": 3,
					"illustration": "card_3_level_3_1717283341661.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 68,
					"hp": 37,
					"attackSpeed": 0.2311363234110986,
					"rarity": "common",
					"id": 3,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							},
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Habitant Of The Claw",
					"cost": 2,
					"illustration": "card_4_level_3_1717531367194.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 26,
					"hp": 174,
					"attackSpeed": 0.35079244927129394,
					"rarity": "common",
					"id": 4,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 2
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Crabvor Recruit",
					"cost": 3,
					"illustration": "card_5_level_3_1717532794506.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 65,
					"hp": 82,
					"attackSpeed": 0.7199999999999999,
					"rarity": "common",
					"id": 5,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Psychalgua Exo Mana",
					"cost": 1,
					"illustration": "card_6_level_3_1717534167407.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 27,
					"hp": 92,
					"attackSpeed": 0.6960000000000001,
					"rarity": "common",
					"id": 6,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Crabvor Preceptor",
					"cost": 5,
					"illustration": "card_7_level_3_1717535735398.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 338,
					"hp": 270,
					"attackSpeed": 0.17130872624446195,
					"rarity": "common",
					"id": 7,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 30
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Crabvor Elite",
					"cost": 4,
					"illustration": "card_8_level_3_1717546938522.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 85,
					"hp": 409,
					"attackSpeed": 0.23999999999999994,
					"rarity": "common",
					"id": 8,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.25,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_2_1720100176579.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 41,
					"hp": 27,
					"attackSpeed": 0.753783791220168,
					"rarity": "legendary",
					"id": 15,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 10
							}
					],
					"level": 2,
					"world": 1
			}
	],
	[
			2.28,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 40,
					"hp": 114,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 69,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.28,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 40,
					"hp": 114,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 70,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.28,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 40,
					"hp": 114,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 71,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.28,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 40,
					"hp": 114,
					"attackSpeed": 0.4,
					"rarity": "rare",
					"id": 72,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.38,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 34,
					"hp": 118,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 39,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.38,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 34,
					"hp": 118,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 40,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.38,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 34,
					"hp": 118,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 41,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.38,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 34,
					"hp": 118,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 42,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.48,
			{
					"name": "Friendly Crabvor",
					"cost": 3,
					"illustration": "card_9_level_3_1719012820414.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 25,
					"hp": 48,
					"attackSpeed": 0.2796680910958633,
					"rarity": "rare",
					"id": 9,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 150
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.48,
			{
					"name": "Crabvor Mage",
					"cost": 4,
					"illustration": "card_10_level_3_1720024380213.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 463,
					"hp": 219,
					"attackSpeed": 0.11999999999999997,
					"rarity": "rare",
					"id": 10,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.48,
			{
					"name": "Crabvor Chief",
					"cost": 4,
					"illustration": "card_11_level_3_1717534307249.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 24,
					"hp": 487,
					"attackSpeed": 0.7080000000000001,
					"rarity": "rare",
					"id": 11,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.48,
			{
					"name": "Primal Crabvor",
					"cost": 6,
					"illustration": "card_12_level_3_1720034142219.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 51,
					"hp": 932,
					"attackSpeed": 0.28979169381669684,
					"rarity": "rare",
					"id": 12,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.49,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 44,
					"hp": 124,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 73,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.49,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 44,
					"hp": 124,
					"attackSpeed": 0.4,
					"rarity": "epic",
					"id": 74,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			2.59,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 43,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.59,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 44,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.59,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 46,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 47,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 48,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 49,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 50,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 51,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 52,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 37,
					"hp": 129,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 53,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.59,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 129,
					"attackSpeed": 0.4,
					"rarity": "legendary",
					"id": 60,
					"states": [],
					"level": 1,
					"world": 4
			}
	],
	[
			2.7,
			{
					"name": "Gigrabvor",
					"cost": 4,
					"illustration": "card_13_level_3_1719956467507.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 93,
					"hp": 226,
					"attackSpeed": 0.17105054507889433,
					"rarity": "epic",
					"id": 13,
					"states": [
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 3
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.7,
			{
					"name": "Hero Crabvor",
					"cost": 2,
					"illustration": "card_14_level_3_1720028021115.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 39,
					"hp": 57,
					"attackSpeed": 0.8437926030910973,
					"rarity": "epic",
					"id": 14,
					"states": [
							{
									"type": "heal",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 30
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			2.7,
			{
					"name": "Ragh Hunter",
					"cost": 2,
					"illustration": "card_16_level_3_1720706351662.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 43,
					"hp": 98,
					"attackSpeed": 0.8759999999999998,
					"rarity": "common",
					"id": 16,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Ragh Spadassin",
					"cost": 3,
					"illustration": "card_17_level_3_1720721238278.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 97,
					"hp": 221,
					"attackSpeed": 0.39599999999999985,
					"rarity": "common",
					"id": 17,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Ragh Keeper",
					"cost": 5,
					"illustration": "card_18_level_3_1720722637985.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 77,
					"hp": 654,
					"attackSpeed": 0.4439999999999999,
					"rarity": "common",
					"id": 18,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Raghorse",
					"cost": 1,
					"illustration": "card_19_level_3_1720977959891.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 31,
					"hp": 167,
					"attackSpeed": 0.468,
					"rarity": "common",
					"id": 19,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_3_1720975951186.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 32,
					"hp": 135,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 20,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Ragh Slave",
					"cost": 1,
					"illustration": "card_21_level_3_1720977474377.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 32,
					"hp": 135,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 21,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Ragh Thrower",
					"cost": 3,
					"illustration": "card_22_level_3_1721050624380.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 18,
					"hp": 135,
					"attackSpeed": 0.45842835497013595,
					"rarity": "common",
					"id": 22,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 30
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "Ragh Fighter",
					"cost": 1,
					"illustration": "card_23_level_3_1721051665630.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 33,
					"hp": 129,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 23,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.7,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_2_1721062086115.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 60,
					"hp": 641,
					"attackSpeed": 0.4553333826430188,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "bleeding",
									"trigger": "onAttack",
									"target": "selfCard",
									"value": 60
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 60
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			2.85,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 41,
					"hp": 142,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 54,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.85,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 41,
					"hp": 142,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 55,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.85,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 41,
					"hp": 142,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 56,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.85,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 41,
					"hp": 142,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 57,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			2.97,
			{
					"name": "Enraged Ragh",
					"cost": 2,
					"illustration": "card_24_level_3_1720725227930.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 66,
					"hp": 120,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 24,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.97,
			{
					"name": "The Clown",
					"cost": 4,
					"illustration": "card_25_level_3_1720974612545.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 86,
					"hp": 365,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 25,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.97,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_3_1721055277711.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 35,
					"hp": 148,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 26,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.97,
			{
					"name": "Gar The Crusader",
					"cost": 1,
					"illustration": "card_27_level_3_1721057505007.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 35,
					"hp": 148,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 27,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			3.11,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 58,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			3.11,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 59,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			3.11,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 61,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 62,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 63,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 64,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 65,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 66,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 67,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 45,
					"hp": 155,
					"attackSpeed": 0.4898979485566356,
					"rarity": "common",
					"id": 68,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.11,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 155,
					"attackSpeed": 0.4,
					"rarity": "legendary",
					"id": 75,
					"states": [],
					"level": 1,
					"world": 5
			}
	],
	[
			3.24,
			{
					"name": "Flying Scorpion",
					"cost": 7,
					"illustration": "card_28_level_3_1720723381906.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 14,
					"hp": 1730,
					"attackSpeed": 0.8672747300156333,
					"rarity": "epic",
					"id": 28,
					"states": [
							{
									"type": "multiAttack",
									"trigger": "onAttack",
									"target": "otherEnnemyCards",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			3.24,
			{
					"name": "The Purificator",
					"cost": 1,
					"illustration": "card_29_level_3_1721059885396.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 29,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			3.24,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 31,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 32,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 33,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 34,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 35,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 36,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 37,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 38,
					"hp": 162,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 38,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.24,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 47,
					"hp": 162,
					"attackSpeed": 0.4898979485566356,
					"rarity": "legendary",
					"id": 45,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			3.38,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_3_1720100190398.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 48,
					"hp": 36,
					"attackSpeed": 0.8693712740304771,
					"rarity": "legendary",
					"id": 15,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 15
							}
					],
					"level": 3,
					"world": 1
			}
	],
	[
			3.42,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 49,
					"hp": 171,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 69,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.42,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 49,
					"hp": 171,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 70,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.42,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 49,
					"hp": 171,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 71,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.42,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 49,
					"hp": 171,
					"attackSpeed": 0.4898979485566356,
					"rarity": "rare",
					"id": 72,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.56,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 42,
					"hp": 178,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 39,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.56,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 42,
					"hp": 178,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 40,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.56,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 42,
					"hp": 178,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 41,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.56,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 42,
					"hp": 178,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 42,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.73,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 54,
					"hp": 186,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 73,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.73,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 54,
					"hp": 186,
					"attackSpeed": 0.4898979485566356,
					"rarity": "epic",
					"id": 74,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			3.89,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 43,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.89,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 44,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.89,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 46,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 47,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 48,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 49,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 50,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 51,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 52,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 46,
					"hp": 194,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 53,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			3.89,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 56,
					"hp": 194,
					"attackSpeed": 0.4898979485566356,
					"rarity": "legendary",
					"id": 60,
					"states": [],
					"level": 2,
					"world": 4
			}
	],
	[
			4.05,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_3_1721061680880.png",
					"worldIllustration": "world_2_cardBackground_1720701361373.jpeg",
					"dmg": 69,
					"hp": 858,
					"attackSpeed": 0.5263875653387291,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "bleeding",
									"trigger": "onAttack",
									"target": "selfCard",
									"value": 90
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 90
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			4.28,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 50,
					"hp": 213,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 54,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.28,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 50,
					"hp": 213,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 55,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.28,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 50,
					"hp": 213,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 56,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.28,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 50,
					"hp": 213,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 57,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.67,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 58,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.67,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 59,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			4.67,
			{
					"name": "common card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 61,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 62,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 63,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 64,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 5",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 65,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 6",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 66,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 7",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 67,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "common card 8",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 55,
					"hp": 233,
					"attackSpeed": 0.6,
					"rarity": "common",
					"id": 68,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			4.67,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 68,
					"hp": 233,
					"attackSpeed": 0.4898979485566356,
					"rarity": "legendary",
					"id": 75,
					"states": [],
					"level": 2,
					"world": 5
			}
	],
	[
			4.86,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 57,
					"hp": 243,
					"attackSpeed": 0.6,
					"rarity": "legendary",
					"id": 45,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			5.13,
			{
					"name": "rare card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 61,
					"hp": 256,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 69,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.13,
			{
					"name": "rare card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 61,
					"hp": 256,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 70,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.13,
			{
					"name": "rare card 3",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 61,
					"hp": 256,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 71,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.13,
			{
					"name": "rare card 4",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 61,
					"hp": 256,
					"attackSpeed": 0.6,
					"rarity": "rare",
					"id": 72,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.6,
			{
					"name": "epic card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 66,
					"hp": 279,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 73,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.6,
			{
					"name": "epic card 2",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 66,
					"hp": 279,
					"attackSpeed": 0.6,
					"rarity": "epic",
					"id": 74,
					"states": [],
					"level": 3,
					"world": 5
			}
	],
	[
			5.83,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 69,
					"hp": 291,
					"attackSpeed": 0.6,
					"rarity": "legendary",
					"id": 60,
					"states": [],
					"level": 3,
					"world": 4
			}
	],
	[
			7,
			{
					"name": "legendary card 1",
					"cost": 1,
					"illustration": "",
					"worldIllustration": "",
					"dmg": 83,
					"hp": 349,
					"attackSpeed": 0.6,
					"rarity": "legendary",
					"id": 75,
					"states": [],
					"level": 3,
					"world": 5
			}
	]
]

export default cardForTest;
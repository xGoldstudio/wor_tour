import { CardType } from "@repo/lib";

const cardForTest: [number, CardType][] = [
	[
			1,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_1_1717529721890.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 42,
					"hp": 133,
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
					"dmg": 35,
					"hp": 65,
					"attackSpeed": 0.16541538461538458,
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
					"dmg": 70,
					"hp": 42,
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
					"dmg": 18,
					"hp": 94,
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
					"dmg": 40,
					"hp": 33,
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
					"dmg": 204,
					"hp": 114,
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
					"dmg": 51,
					"hp": 162,
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
					"dmg": 27,
					"hp": 64,
					"attackSpeed": 0.3319137784434423,
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
					"dmg": 276,
					"hp": 87,
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
					"dmg": 14,
					"hp": 193,
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
					"dmg": 27,
					"hp": 333,
					"attackSpeed": 0.19064580393439012,
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
					"dmg": 63,
					"hp": 116,
					"attackSpeed": 0.12976372739686348,
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
					"dmg": 25,
					"hp": 26,
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
					"illustration": "card_16_level_1_1724596127798.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 27,
					"hp": 42,
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
					"illustration": "card_17_level_1_1724595447915.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 60,
					"hp": 91,
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
					"illustration": "card_18_level_1_1724595269419.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 44,
					"hp": 250,
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
					"illustration": "card_19_level_1_1724596395599.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 18,
					"hp": 57,
					"attackSpeed": 0.27547495641691866,
					"rarity": "common",
					"id": 19,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 50
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_1_1724597621790.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 52,
					"hp": 46,
					"attackSpeed": 0.2,
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
					"illustration": "card_21_level_1_1724595139220.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
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
					"illustration": "card_22_level_1_1724595811636.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 14,
					"hp": 100,
					"attackSpeed": 0.41099802761341203,
					"rarity": "common",
					"id": 22,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 5
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.2,
			{
					"name": "Ragh Commander",
					"cost": 3,
					"illustration": "card_23_level_1_1724595700918.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 45,
					"hp": 135,
					"attackSpeed": 0.20800000000000002,
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
					"illustration": "card_24_level_1_1724595174403.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 31,
					"hp": 26,
					"attackSpeed": 0.28904428904428897,
					"rarity": "rare",
					"id": 24,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 20
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "The Clown",
					"cost": 4,
					"illustration": "card_25_level_1_1724597999583.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 19,
					"hp": 19,
					"attackSpeed": 0.14675659646073844,
					"rarity": "rare",
					"id": 25,
					"states": [
							{
									"type": "clone",
									"trigger": "onDeath",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.32,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_1_1724596834901.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
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
					"name": "Gar The Truthfinder",
					"cost": 3,
					"illustration": "card_27_level_1_1724597834484.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 24,
					"hp": 145,
					"attackSpeed": 0.44800000000000006,
					"rarity": "rare",
					"id": 27,
					"states": [],
					"level": 1,
					"world": 2
			}
	],
	[
			1.4,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_2_1717530044081.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 49,
					"hp": 186,
					"attackSpeed": 0.14198591479439082,
					"rarity": "common",
					"id": 1,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.4,
			{
					"name": "Small Bitter",
					"cost": 3,
					"illustration": "card_2_level_2_1717531258110.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 42,
					"hp": 91,
					"attackSpeed": 0.19634411755894293,
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
			1.4,
			{
					"name": "Medusor",
					"cost": 3,
					"illustration": "card_3_level_2_1717283337041.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 65,
					"hp": 35,
					"attackSpeed": 0.23630769230769222,
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
			1.4,
			{
					"name": "Habitant Of The Claw",
					"cost": 2,
					"illustration": "card_4_level_2_1717531361979.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 20,
					"hp": 112,
					"attackSpeed": 0.28680045235865576,
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
			1.4,
			{
					"name": "Crabvor Recruit",
					"cost": 3,
					"illustration": "card_5_level_2_1717532831361.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 47,
					"hp": 47,
					"attackSpeed": 0.5679436591775631,
					"rarity": "common",
					"id": 5,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.4,
			{
					"name": "Psychalgua Exo Mana",
					"cost": 1,
					"illustration": "card_6_level_2_1717534163302.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 21,
					"hp": 57,
					"attackSpeed": 0.5490122038716444,
					"rarity": "common",
					"id": 6,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.4,
			{
					"name": "Crabvor Preceptor",
					"cost": 5,
					"illustration": "card_7_level_2_1717535731862.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 230,
					"hp": 146,
					"attackSpeed": 0.13565661425710868,
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
			1.4,
			{
					"name": "Crabvor Elite",
					"cost": 4,
					"illustration": "card_8_level_2_1717546935760.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 60,
					"hp": 227,
					"attackSpeed": 0.18931455305918768,
					"rarity": "common",
					"id": 8,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.4,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_1_1720100170687.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 39,
					"hp": 18,
					"attackSpeed": 0.784,
					"rarity": "legendary",
					"id": 15,
					"states": [],
					"level": 1,
					"world": 1
			}
	],
	[
			1.44,
			{
					"name": "Migthy Cave Dragon",
					"cost": 7,
					"illustration": "card_28_level_1_1724597294808.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 7,
					"hp": 617,
					"attackSpeed": 0.580093390892409,
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
					"cost": 5,
					"illustration": "card_29_level_1_1724598452257.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 49,
					"hp": 263,
					"attackSpeed": 0.42400000000000004,
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
					"name": "Dark Mage",
					"cost": 3,
					"illustration": "card_31_level_1_1724546374794.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 114,
					"hp": 70,
					"attackSpeed": 0.21600000000000003,
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
					"name": "Royals Assassin",
					"cost": 1,
					"illustration": "card_32_level_1_1724547440893.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 18,
					"hp": 60,
					"attackSpeed": 0.6400000000000001,
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
					"name": "Spar Royals Guard",
					"cost": 2,
					"illustration": "card_33_level_1_1724547536275.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 18,
					"hp": 105,
					"attackSpeed": 0.32553846153846133,
					"rarity": "common",
					"id": 33,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 10
							}
					],
					"level": 1,
					"world": 3
			}
	],
	[
			1.44,
			{
					"name": "Ultra: Mega Royal",
					"cost": 5,
					"illustration": "card_34_level_1_1724547688780.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 32,
					"hp": 292,
					"attackSpeed": 0.5279999999999999,
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
					"name": "Wind Mage",
					"cost": 1,
					"illustration": "card_35_level_1_1724548795332.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 27,
					"hp": 51,
					"attackSpeed": 0.48,
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
					"name": "Black Guard",
					"cost": 1,
					"illustration": "card_36_level_1_1724588519389.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 26,
					"hp": 17,
					"attackSpeed": 0.6960000000000001,
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
					"name": "Dragon Hunter",
					"cost": 1,
					"illustration": "card_37_level_1_1724599084738.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
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
					"name": "King's Soldier",
					"cost": 1,
					"illustration": "card_38_level_1_1724599146811.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
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
			1.54,
			{
					"name": "Friendly Crabvor",
					"cost": 3,
					"illustration": "card_9_level_2_1719012817640.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 22,
					"hp": 43,
					"attackSpeed": 0.2720630246889584,
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
			1.54,
			{
					"name": "Crabvor Mage",
					"cost": 4,
					"illustration": "card_10_level_2_1720024251885.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 326,
					"hp": 121,
					"attackSpeed": 0.09465727652959384,
					"rarity": "rare",
					"id": 10,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.54,
			{
					"name": "Crabvor Chief",
					"cost": 4,
					"illustration": "card_11_level_2_1717534301963.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 17,
					"hp": 270,
					"attackSpeed": 0.5584779315246039,
					"rarity": "rare",
					"id": 11,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			1.54,
			{
					"name": "Primal Crabvor",
					"cost": 6,
					"illustration": "card_12_level_2_1720034153300.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 33,
					"hp": 471,
					"attackSpeed": 0.22663397544097874,
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
			1.58,
			{
					"name": "Royals Sergent",
					"cost": 2,
					"illustration": "card_39_level_1_1724548043272.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 17,
					"hp": 109,
					"attackSpeed": 0.3736355175836473,
					"rarity": "rare",
					"id": 39,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 1,
					"world": 3
			}
	],
	[
			1.58,
			{
					"name": "The Apprentice",
					"cost": 4,
					"illustration": "card_40_level_1_1724548861970.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 55,
					"hp": 288,
					"attackSpeed": 0.15199999999999997,
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
					"name": "Ray, Dragon Hunter",
					"cost": 3,
					"illustration": "card_41_level_1_1724588120924.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 47,
					"hp": 133,
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
					"name": "Shloppy Fire Clown",
					"cost": 5,
					"illustration": "card_42_level_1_1724598741051.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 29,
					"hp": 303,
					"attackSpeed": 0.7120000000000001,
					"rarity": "rare",
					"id": 42,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			1.68,
			{
					"name": "Gigrabvor",
					"cost": 4,
					"illustration": "card_13_level_2_1719956464360.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 67,
					"hp": 135,
					"attackSpeed": 0.14006243592042406,
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
			1.68,
			{
					"name": "Hero Crabvor",
					"cost": 2,
					"illustration": "card_14_level_2_1720027978144.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 29,
					"hp": 34,
					"attackSpeed": 0.66538743647968,
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
			1.68,
			{
					"name": "Ragh Hunter",
					"cost": 2,
					"illustration": "card_16_level_2_1724596133428.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 32,
					"hp": 58,
					"attackSpeed": 0.6909981186660351,
					"rarity": "common",
					"id": 16,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Ragh Spadassin",
					"cost": 3,
					"illustration": "card_17_level_2_1724595455500.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 71,
					"hp": 127,
					"attackSpeed": 0.31236901254765964,
					"rarity": "common",
					"id": 17,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Ragh Keeper",
					"cost": 5,
					"illustration": "card_18_level_2_1724595272677.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 52,
					"hp": 350,
					"attackSpeed": 0.35023192315949725,
					"rarity": "common",
					"id": 18,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Raghorse",
					"cost": 1,
					"illustration": "card_19_level_2_1724596401929.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 21,
					"hp": 80,
					"attackSpeed": 0.3255447048236382,
					"rarity": "common",
					"id": 19,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 75
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_2_1724597630638.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 61,
					"hp": 65,
					"attackSpeed": 0.23664319132398465,
					"rarity": "common",
					"id": 20,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Ragh Slave",
					"cost": 1,
					"illustration": "card_21_level_2_1724595143062.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 25,
					"hp": 84,
					"attackSpeed": 0.4732863826479693,
					"rarity": "common",
					"id": 21,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Ragh Thrower",
					"cost": 3,
					"illustration": "card_22_level_2_1724595815675.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 15,
					"hp": 112,
					"attackSpeed": 0.4353875923738811,
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
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "Ragh Commander",
					"cost": 3,
					"illustration": "card_23_level_2_1724595704638.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 52,
					"hp": 176,
					"attackSpeed": 0.2373988394142311,
					"rarity": "common",
					"id": 23,
					"states": [
							{
									"type": "rush",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": null
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			1.68,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_1_1724595407619.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 39,
					"hp": 352,
					"attackSpeed": 0.38359744524696726,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 15
							}
					],
					"level": 1,
					"world": 2
			}
	],
	[
			1.73,
			{
					"name": "Axar The Imperial",
					"cost": 3,
					"illustration": "card_43_level_1_1724548148872.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 37,
					"hp": 35,
					"attackSpeed": 0.4338391118836568,
					"rarity": "epic",
					"id": 43,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 40
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 10
							}
					],
					"level": 1,
					"world": 3
			}
	],
	[
			1.73,
			{
					"name": "King's Guardian",
					"cost": 2,
					"illustration": "card_44_level_1_1724599005923.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 31,
					"hp": 32,
					"attackSpeed": 0.6240737223453273,
					"rarity": "epic",
					"id": 44,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 1,
					"world": 3
			}
	],
	[
			1.85,
			{
					"name": "Enraged Ragh",
					"cost": 2,
					"illustration": "card_24_level_2_1724595179097.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 29,
					"hp": 23,
					"attackSpeed": 0.2703962703962704,
					"rarity": "rare",
					"id": 24,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 40
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			1.85,
			{
					"name": "The Clown",
					"cost": 3,
					"illustration": "card_25_level_2_1724598004927.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 21,
					"hp": 31,
					"attackSpeed": 0.210875205182259,
					"rarity": "rare",
					"id": 25,
					"states": [
							{
									"type": "clone",
									"trigger": "onDeath",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			1.85,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_2_1724596844539.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 27,
					"hp": 92,
					"attackSpeed": 0.4732863826479693,
					"rarity": "rare",
					"id": 26,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.85,
			{
					"name": "Gar The Truthfinder",
					"cost": 3,
					"illustration": "card_27_level_2_1724597837967.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 29,
					"hp": 203,
					"attackSpeed": 0.5300807485657256,
					"rarity": "rare",
					"id": 27,
					"states": [],
					"level": 2,
					"world": 2
			}
	],
	[
			1.96,
			{
					"name": "Multi-eyes Mud",
					"cost": 3,
					"illustration": "card_1_level_3_1717530116564.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 59,
					"hp": 261,
					"attackSpeed": 0.168,
					"rarity": "common",
					"id": 1,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			1.96,
			{
					"name": "Small Bitter",
					"cost": 3,
					"illustration": "card_2_level_3_1717531263090.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 50,
					"hp": 128,
					"attackSpeed": 0.23177150986884745,
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
			1.96,
			{
					"name": "Medusor",
					"cost": 3,
					"illustration": "card_3_level_3_1717283341661.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 59,
					"hp": 29,
					"attackSpeed": 0.21354136489151856,
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
			1.96,
			{
					"name": "Habitant Of The Claw",
					"cost": 2,
					"illustration": "card_4_level_3_1717531367194.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 23,
					"hp": 144,
					"attackSpeed": 0.3261724907928318,
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
			1.96,
			{
					"name": "Crabvor Recruit",
					"cost": 3,
					"illustration": "card_5_level_3_1717532794506.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 56,
					"hp": 66,
					"attackSpeed": 0.6719999999999999,
					"rarity": "common",
					"id": 5,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			1.96,
			{
					"name": "Psychalgua Exo Mana",
					"cost": 1,
					"illustration": "card_6_level_3_1717534167407.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 25,
					"hp": 80,
					"attackSpeed": 0.6496000000000001,
					"rarity": "common",
					"id": 6,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			1.96,
			{
					"name": "Crabvor Preceptor",
					"cost": 5,
					"illustration": "card_7_level_3_1717535735398.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 267,
					"hp": 195,
					"attackSpeed": 0.15705332446342918,
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
			1.96,
			{
					"name": "Crabvor Elite",
					"cost": 4,
					"illustration": "card_8_level_3_1717546938522.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 71,
					"hp": 318,
					"attackSpeed": 0.22399999999999995,
					"rarity": "common",
					"id": 8,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			1.96,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_2_1720100176579.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 46,
					"hp": 26,
					"attackSpeed": 0.9276413099900198,
					"rarity": "legendary",
					"id": 15,
					"states": [],
					"level": 2,
					"world": 1
			}
	],
	[
			2.02,
			{
					"name": "Migthy Cave Dragon",
					"cost": 7,
					"illustration": "card_28_level_2_1724597281965.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 9,
					"hp": 861,
					"attackSpeed": 0.6851406265551312,
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
			2.02,
			{
					"name": "The Purificator",
					"cost": 5,
					"illustration": "card_29_level_2_1724598470056.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 56,
					"hp": 337,
					"attackSpeed": 0.4801548448157116,
					"rarity": "epic",
					"id": 29,
					"states": [
							{
									"type": "sacredDuelist",
									"trigger": "idle",
									"target": "selfCard",
									"value": null
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			2.02,
			{
					"name": "Dark Mage",
					"cost": 3,
					"illustration": "card_31_level_2_1724546381800.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 135,
					"hp": 98,
					"attackSpeed": 0.2555746466299034,
					"rarity": "common",
					"id": 31,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Royals Assassin",
					"cost": 1,
					"illustration": "card_32_level_2_1724547447088.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 22,
					"hp": 84,
					"attackSpeed": 0.7572582122367509,
					"rarity": "common",
					"id": 32,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Spar Royals Guard",
					"cost": 2,
					"illustration": "card_33_level_2_1724547558676.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 18,
					"hp": 113,
					"attackSpeed": 0.33840105644043134,
					"rarity": "common",
					"id": 33,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 20
							},
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Ultra: Mega Royal",
					"cost": 5,
					"illustration": "card_34_level_2_1724547684095.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 38,
					"hp": 408,
					"attackSpeed": 0.6247380250953193,
					"rarity": "common",
					"id": 34,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Wind Mage",
					"cost": 1,
					"illustration": "card_35_level_2_1724548822540.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 32,
					"hp": 72,
					"attackSpeed": 0.5679436591775631,
					"rarity": "common",
					"id": 35,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Black Guard",
					"cost": 1,
					"illustration": "card_36_level_2_1724588523774.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 30,
					"hp": 24,
					"attackSpeed": 0.8235183058074667,
					"rarity": "common",
					"id": 36,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Dragon Hunter",
					"cost": 1,
					"illustration": "card_37_level_2_1724599100311.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 30,
					"hp": 100,
					"attackSpeed": 0.4732863826479693,
					"rarity": "common",
					"id": 37,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "King's Soldier",
					"cost": 1,
					"illustration": "card_38_level_2_1724599170922.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 30,
					"hp": 100,
					"attackSpeed": 0.4732863826479693,
					"rarity": "common",
					"id": 38,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.02,
			{
					"name": "Le Comte",
					"cost": 7,
					"illustration": "card_45_level_1_1724548721554.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 268,
					"hp": 311,
					"attackSpeed": 0.352,
					"rarity": "legendary",
					"id": 45,
					"states": [],
					"level": 1,
					"world": 3
			}
	],
	[
			2.16,
			{
					"name": "Friendly Crabvor",
					"cost": 3,
					"illustration": "card_9_level_3_1719012820414.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 8,
					"hp": 6,
					"attackSpeed": 0.10844540075309303,
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
			2.16,
			{
					"name": "Crabvor Mage",
					"cost": 4,
					"illustration": "card_10_level_3_1720024380213.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 386,
					"hp": 170,
					"attackSpeed": 0.11199999999999997,
					"rarity": "rare",
					"id": 10,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.16,
			{
					"name": "Crabvor Chief",
					"cost": 4,
					"illustration": "card_11_level_3_1717534307249.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 20,
					"hp": 378,
					"attackSpeed": 0.6608,
					"rarity": "rare",
					"id": 11,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.16,
			{
					"name": "Primal Crabvor",
					"cost": 6,
					"illustration": "card_12_level_3_1720034142219.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 39,
					"hp": 669,
					"attackSpeed": 0.27001719347407216,
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
			2.22,
			{
					"name": "Royals Sergent",
					"cost": 2,
					"illustration": "card_39_level_2_1724548050955.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 21,
					"hp": 168,
					"attackSpeed": 0.4644603659065856,
					"rarity": "rare",
					"id": 39,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			2.22,
			{
					"name": "The Apprentice",
					"cost": 4,
					"illustration": "card_40_level_2_1724548866577.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 65,
					"hp": 404,
					"attackSpeed": 0.1798488254062283,
					"rarity": "rare",
					"id": 40,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.22,
			{
					"name": "Ray, Dragon Hunter",
					"cost": 3,
					"illustration": "card_41_level_2_1724588125538.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 56,
					"hp": 187,
					"attackSpeed": 0.4732863826479693,
					"rarity": "rare",
					"id": 41,
					"states": [],
					"level": 2,
					"world": 3
			}
	],
	[
			2.22,
			{
					"name": "Shloppy Fire Clown",
					"cost": 5,
					"illustration": "card_42_level_2_1724598743562.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 27,
					"hp": 250,
					"attackSpeed": 0.646618764426572,
					"rarity": "rare",
					"id": 42,
					"states": [
							{
									"type": "flameThrower",
									"trigger": "onDirectAttackHit",
									"target": "enemyCards",
									"value": 5
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			2.35,
			{
					"name": "Gigrabvor",
					"cost": 4,
					"illustration": "card_13_level_3_1719956467507.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 75,
					"hp": 169,
					"attackSpeed": 0.156540369558121,
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
			2.35,
			{
					"name": "Hero Crabvor",
					"cost": 2,
					"illustration": "card_14_level_3_1720028021115.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 34,
					"hp": 47,
					"attackSpeed": 0.7796123315469042,
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
			2.35,
			{
					"name": "Ragh Hunter",
					"cost": 2,
					"illustration": "card_16_level_3_1724596137978.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 37,
					"hp": 78,
					"attackSpeed": 0.7966358974358974,
					"rarity": "common",
					"id": 16,
					"states": [
							{
									"type": "rush",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Ragh Spadassin",
					"cost": 3,
					"illustration": "card_17_level_3_1724595458556.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 84,
					"hp": 178,
					"attackSpeed": 0.36959999999999993,
					"rarity": "common",
					"id": 17,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Ragh Keeper",
					"cost": 5,
					"illustration": "card_18_level_3_1724595275671.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 62,
					"hp": 490,
					"attackSpeed": 0.41439999999999994,
					"rarity": "common",
					"id": 18,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Raghorse",
					"cost": 1,
					"illustration": "card_19_level_3_1724596406073.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 20,
					"hp": 68,
					"attackSpeed": 0.29886315789473694,
					"rarity": "common",
					"id": 19,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 250
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Rax The Crusader",
					"cost": 1,
					"illustration": "card_20_level_3_1724597636328.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 65,
					"hp": 72,
					"attackSpeed": 0.2486338797814207,
					"rarity": "common",
					"id": 20,
					"states": [
							{
									"type": "sacredDuelist",
									"trigger": "idle",
									"target": "selfCard",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Ragh Slave",
					"cost": 1,
					"illustration": "card_21_level_3_1724595145734.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 29,
					"hp": 117,
					"attackSpeed": 0.5599999999999999,
					"rarity": "common",
					"id": 21,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Ragh Thrower",
					"cost": 3,
					"illustration": "card_22_level_3_1724595817743.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 17,
					"hp": 133,
					"attackSpeed": 0.47412103724680754,
					"rarity": "common",
					"id": 22,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 15
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "Ragh Commander",
					"cost": 3,
					"illustration": "card_23_level_3_1724595707693.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 62,
					"hp": 253,
					"attackSpeed": 0.2843863954034146,
					"rarity": "common",
					"id": 23,
					"states": [
							{
									"type": "rush",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.35,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_2_1724595412137.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 41,
					"hp": 403,
					"attackSpeed": 0.41036673872694224,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 30
							}
					],
					"level": 2,
					"world": 2
			}
	],
	[
			2.42,
			{
					"name": "Axar The Imperial",
					"cost": 3,
					"illustration": "card_43_level_2_1724548152771.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 40,
					"hp": 41,
					"attackSpeed": 0.46635985097523563,
					"rarity": "epic",
					"id": 43,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 70
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 15
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			2.42,
			{
					"name": "King's Guardian",
					"cost": 2,
					"illustration": "card_44_level_2_1724599035924.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 39,
					"hp": 51,
					"attackSpeed": 0.7782958880970013,
					"rarity": "epic",
					"id": 44,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			2.59,
			{
					"name": "Enraged Ragh",
					"cost": 2,
					"illustration": "card_24_level_3_1724595182071.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 32,
					"hp": 28,
					"attackSpeed": 0.29999869791384093,
					"rarity": "rare",
					"id": 24,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 60
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.59,
			{
					"name": "The Clown",
					"cost": 3,
					"illustration": "card_25_level_3_1724598010005.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 0,
					"hp": 0,
					"attackSpeed": 3.5170071074516565e-16,
					"rarity": "rare",
					"id": 25,
					"states": [
							{
									"type": "clone",
									"trigger": "onDeath",
									"target": "selfCard",
									"value": 2
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.59,
			{
					"name": "Giant Crocodyle",
					"cost": 1,
					"illustration": "card_26_level_3_1724596851616.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 33,
					"hp": 129,
					"attackSpeed": 0.5599999999999999,
					"rarity": "rare",
					"id": 26,
					"states": [],
					"level": 3,
					"world": 2
			}
	],
	[
			2.59,
			{
					"name": "Gar The Truthfinder",
					"cost": 3,
					"illustration": "card_27_level_3_1724597840216.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 32,
					"hp": 251,
					"attackSpeed": 0.5904449169905692,
					"rarity": "rare",
					"id": 27,
					"states": [
							{
									"type": "sacredDuelist",
									"trigger": "idle",
									"target": "selfCard",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.74,
			{
					"name": "Queen crabvor",
					"cost": 3,
					"illustration": "card_15_level_3_1720100190398.png",
					"worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
					"dmg": 55,
					"hp": 37,
					"attackSpeed": 1.0976,
					"rarity": "legendary",
					"id": 15,
					"states": [],
					"level": 3,
					"world": 1
			}
	],
	[
			2.82,
			{
					"name": "Migthy Cave Dragon",
					"cost": 7,
					"illustration": "card_28_level_3_1724597271463.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 11,
					"hp": 1202,
					"attackSpeed": 0.8098618821046345,
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
			2.82,
			{
					"name": "The Purificator",
					"cost": 5,
					"illustration": "card_29_level_3_1724598475148.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 67,
					"hp": 483,
					"attackSpeed": 0.5743564258970923,
					"rarity": "epic",
					"id": 29,
					"states": [
							{
									"type": "sacredDuelist",
									"trigger": "idle",
									"target": "selfCard",
									"value": null
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			2.82,
			{
					"name": "Dark Mage",
					"cost": 3,
					"illustration": "card_31_level_3_1724546385330.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 159,
					"hp": 138,
					"attackSpeed": 0.3024,
					"rarity": "common",
					"id": 31,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Royals Assassin",
					"cost": 1,
					"illustration": "card_32_level_3_1724547450834.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 26,
					"hp": 118,
					"attackSpeed": 0.8960000000000001,
					"rarity": "common",
					"id": 32,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Spar Royals Guard",
					"cost": 2,
					"illustration": "card_33_level_3_1724547562817.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 21,
					"hp": 157,
					"attackSpeed": 0.3971718634027623,
					"rarity": "common",
					"id": 33,
					"states": [
							{
									"type": "bannerOfComand",
									"trigger": "onPlacement",
									"target": "allyCards",
									"value": 30
							},
							{
									"type": "riposte",
									"trigger": "onDirectlyAttacked",
									"target": "directEnnemyCard",
									"value": 1
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Ultra: Mega Royal",
					"cost": 5,
					"illustration": "card_34_level_3_1724547670093.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 43,
					"hp": 538,
					"attackSpeed": 0.7173501279514113,
					"rarity": "common",
					"id": 34,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Wind Mage",
					"cost": 1,
					"illustration": "card_35_level_3_1724548825896.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 38,
					"hp": 101,
					"attackSpeed": 0.6719999999999999,
					"rarity": "common",
					"id": 35,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Black Guard",
					"cost": 1,
					"illustration": "card_36_level_3_1724588527337.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 36,
					"hp": 33,
					"attackSpeed": 0.9744,
					"rarity": "common",
					"id": 36,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Dragon Hunter",
					"cost": 1,
					"illustration": "card_37_level_3_1724599117480.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 36,
					"hp": 141,
					"attackSpeed": 0.5599999999999999,
					"rarity": "common",
					"id": 37,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "King's Soldier",
					"cost": 1,
					"illustration": "card_38_level_3_1724599174364.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 36,
					"hp": 141,
					"attackSpeed": 0.5599999999999999,
					"rarity": "common",
					"id": 38,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			2.82,
			{
					"name": "Le Comte",
					"cost": 7,
					"illustration": "card_45_level_2_1724548729769.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 235,
					"hp": 238,
					"attackSpeed": 0.30802904892671634,
					"rarity": "legendary",
					"id": 45,
					"states": [
							{
									"type": "flameThrower",
									"trigger": "onDirectAttackHit",
									"target": "enemyCards",
									"value": 25
							}
					],
					"level": 2,
					"world": 3
			}
	],
	[
			3.1,
			{
					"name": "Royals Sergent",
					"cost": 2,
					"illustration": "card_39_level_3_1724548056544.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 25,
					"hp": 252,
					"attackSpeed": 0.5671599794007178,
					"rarity": "rare",
					"id": 39,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			3.1,
			{
					"name": "The Apprentice",
					"cost": 4,
					"illustration": "card_40_level_3_1724548870336.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 77,
					"hp": 566,
					"attackSpeed": 0.21279999999999993,
					"rarity": "rare",
					"id": 40,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.1,
			{
					"name": "Ray, Dragon Hunter",
					"cost": 3,
					"illustration": "card_41_level_3_1724588132331.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 66,
					"hp": 262,
					"attackSpeed": 0.5599999999999999,
					"rarity": "rare",
					"id": 41,
					"states": [],
					"level": 3,
					"world": 3
			}
	],
	[
			3.1,
			{
					"name": "Shloppy Fire Clown",
					"cost": 5,
					"illustration": "card_42_level_3_1724598746305.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 27,
					"hp": 246,
					"attackSpeed": 0.6417697831609365,
					"rarity": "rare",
					"id": 42,
					"states": [
							{
									"type": "flameThrower",
									"trigger": "onDirectAttackHit",
									"target": "enemyCards",
									"value": 10
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			3.29,
			{
					"name": "King Of The Ragh",
					"cost": 6,
					"illustration": "card_30_level_3_1724595417108.png",
					"worldIllustration": "world_2_cardBackground_1724600115619.png",
					"dmg": 41,
					"hp": 401,
					"attackSpeed": 0.4098572826165223,
					"rarity": "legendary",
					"id": 30,
					"states": [
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 60
							}
					],
					"level": 3,
					"world": 2
			}
	],
	[
			3.39,
			{
					"name": "Axar The Imperial",
					"cost": 3,
					"illustration": "card_43_level_3_1724548159076.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 16,
					"hp": 7,
					"attackSpeed": 0.19648471314583232,
					"rarity": "epic",
					"id": 43,
					"states": [
							{
									"type": "rage",
									"trigger": "idle",
									"target": "selfCard",
									"value": 300
							},
							{
									"type": "massacre",
									"trigger": "onDirectAttackHit",
									"target": "directEnnemyCard",
									"value": 70
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			3.39,
			{
					"name": "King's Guardian",
					"cost": 2,
					"illustration": "card_44_level_3_1724599046389.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 48,
					"hp": 73,
					"attackSpeed": 0.9375091342584955,
					"rarity": "epic",
					"id": 44,
					"states": [
							{
									"type": "divineShield",
									"trigger": "onDirectlyAttacked",
									"target": "selfCard",
									"value": 1
							}
					],
					"level": 3,
					"world": 3
			}
	],
	[
			3.95,
			{
					"name": "Le Comte",
					"cost": 7,
					"illustration": "card_45_level_3_1724548736343.png",
					"worldIllustration": "world_3_cardBackground_1724600017645.png",
					"dmg": 228,
					"hp": 225,
					"attackSpeed": 0.29987935846514746,
					"rarity": "legendary",
					"id": 45,
					"states": [
							{
									"type": "flameThrower",
									"trigger": "onDirectAttackHit",
									"target": "enemyCards",
									"value": 50
							}
					],
					"level": 3,
					"world": 3
			}
	]
]

export default cardForTest;
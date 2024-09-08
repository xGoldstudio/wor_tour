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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1,
        {
            "name": "Small Bitter",
            "cost": 3,
            "illustration": "card_2_level_1_1717531255144.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 36,
            "hp": 65,
            "attackSpeed": 0.16546298679765215,
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 95,
            "attackSpeed": 0.26502924366944863,
            "rarity": "common",
            "id": 4,
            "states": [],
            "level": 1,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.1,
        {
            "name": "Friendly Crabvor",
            "cost": 3,
            "illustration": "card_9_level_1_1719012812863.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 23,
            "hp": 55,
            "attackSpeed": 0.2682237871628838,
            "rarity": "rare",
            "id": 9,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 50
                }
            ],
            "level": 1,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 196,
            "attackSpeed": 0.4756732071496145,
            "rarity": "rare",
            "id": 11,
            "states": [],
            "level": 1,
            "world": 1,
            "isPvp": false
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
            "attackSpeed": 0.19039432764659772,
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
            "world": 1,
            "isPvp": false
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
            "hp": 118,
            "attackSpeed": 0.13114877048603998,
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.2,
        {
            "name": "Hero Crabvor",
            "cost": 2,
            "illustration": "card_14_level_1_1720028759577.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 28,
            "hp": 31,
            "attackSpeed": 0.6320000000000001,
            "rarity": "epic",
            "id": 14,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 0
                }
            ],
            "level": 1,
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.2,
        {
            "name": "Ragh Hunter",
            "cost": 2,
            "illustration": "card_16_level_1_1724596127798.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 28,
            "hp": 42,
            "attackSpeed": 0.5874119082892344,
            "rarity": "common",
            "id": 16,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "hp": 60,
            "attackSpeed": 0.2812329994861912,
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
            "world": 2,
            "isPvp": false
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
            "hp": 47,
            "attackSpeed": 0.20155644370746373,
            "rarity": "common",
            "id": 20,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
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
            "hp": 61,
            "attackSpeed": 0.4062019202317981,
            "rarity": "common",
            "id": 21,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.2,
        {
            "name": "Ragh Thrower",
            "cost": 3,
            "illustration": "card_22_level_1_1724595811636.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 15,
            "hp": 100,
            "attackSpeed": 0.41146749567857727,
            "rarity": "common",
            "id": 22,
            "states": [
                {
                    "type": "massacre",
                    "trigger": "onDirectAttackHit",
                    "target": "directEnnemyCard",
                    "value": 9
                }
            ],
            "level": 1,
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.2,
        {
            "name": "Ragh Commander",
            "cost": 3,
            "illustration": "card_23_level_1_1724595700918.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 46,
            "hp": 136,
            "attackSpeed": 0.20881091925471715,
            "rarity": "common",
            "id": 23,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
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
            "hp": 28,
            "attackSpeed": 0.2958039891549808,
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
            "world": 2,
            "isPvp": false
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
            "hp": 20,
            "attackSpeed": 0.15000000000000002,
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
            "world": 2,
            "isPvp": false
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
            "hp": 67,
            "attackSpeed": 0.40311288741492746,
            "rarity": "rare",
            "id": 26,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
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
            "hp": 146,
            "attackSpeed": 0.4497465953178523,
            "rarity": "rare",
            "id": 27,
            "states": [],
            "level": 1,
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.4,
        {
            "name": "Multi-eyes Mud",
            "cost": 3,
            "illustration": "card_1_level_2_1717530044081.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 50,
            "hp": 188,
            "attackSpeed": 0.14253946821845523,
            "rarity": "common",
            "id": 1,
            "states": [],
            "level": 2,
            "world": 1,
            "isPvp": false
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
            "hp": 92,
            "attackSpeed": 0.19698324801870845,
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
            "world": 1,
            "isPvp": false
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
            "hp": 36,
            "attackSpeed": 0.2364538009844629,
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
            "world": 1,
            "isPvp": false
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
            "hp": 114,
            "attackSpeed": 0.28957382478394,
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
            "world": 1,
            "isPvp": false
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
            "hp": 48,
            "attackSpeed": 0.5723635208501673,
            "rarity": "common",
            "id": 5,
            "states": [],
            "level": 2,
            "world": 1,
            "isPvp": false
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
            "hp": 59,
            "attackSpeed": 0.5575245286083834,
            "rarity": "common",
            "id": 6,
            "states": [],
            "level": 2,
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.4,
        {
            "name": "Crabvor Preceptor",
            "cost": 5,
            "illustration": "card_7_level_2_1717535731862.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 241,
            "hp": 159,
            "attackSpeed": 0.14198591479439082,
            "rarity": "common",
            "id": 7,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 0
                }
            ],
            "level": 2,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 19,
            "attackSpeed": 0.7906560329302802,
            "rarity": "legendary",
            "id": 15,
            "states": [],
            "level": 1,
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.44,
        {
            "name": "Migthy Cave Dragon",
            "cost": 7,
            "illustration": "card_28_level_1_1724597294808.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 8,
            "hp": 617,
            "attackSpeed": 0.5803420327703311,
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
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.54,
        {
            "name": "Friendly Crabvor",
            "cost": 3,
            "illustration": "card_9_level_2_1719012817640.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 27,
            "hp": 77,
            "attackSpeed": 0.31736666491615023,
            "rarity": "rare",
            "id": 9,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 70
                }
            ],
            "level": 2,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 474,
            "attackSpeed": 0.22721135535003528,
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "Gigrabvor",
            "cost": 4,
            "illustration": "card_13_level_2_1719956464360.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 68,
            "hp": 136,
            "attackSpeed": 0.1404991103174678,
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "Hero Crabvor",
            "cost": 2,
            "illustration": "card_14_level_2_1720027978144.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 33,
            "hp": 44,
            "attackSpeed": 0.7536119691193871,
            "rarity": "epic",
            "id": 14,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 0
                }
            ],
            "level": 2,
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "Ragh Hunter",
            "cost": 2,
            "illustration": "card_16_level_2_1724596133428.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 33,
            "hp": 59,
            "attackSpeed": 0.6936920786631485,
            "rarity": "common",
            "id": 16,
            "states": [],
            "level": 2,
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "hp": 82,
            "attackSpeed": 0.3279248389494154,
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "Rax The Crusader",
            "cost": 1,
            "illustration": "card_20_level_2_1724597630638.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 62,
            "hp": 65,
            "attackSpeed": 0.2373354693255941,
            "rarity": "common",
            "id": 20,
            "states": [],
            "level": 2,
            "world": 2,
            "isPvp": false
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
            "hp": 85,
            "attackSpeed": 0.4769696007084728,
            "rarity": "common",
            "id": 21,
            "states": [],
            "level": 2,
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "Ragh Thrower",
            "cost": 3,
            "illustration": "card_22_level_2_1724595815675.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 17,
            "hp": 142,
            "attackSpeed": 0.48952262460482865,
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
            "world": 2,
            "isPvp": false
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
            "hp": 178,
            "attackSpeed": 0.2382939361377037,
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        1.68,
        {
            "name": "King Of The Ragh",
            "cost": 6,
            "illustration": "card_30_level_1_1724595407619.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 36,
            "hp": 300,
            "attackSpeed": 0.35417509793885854,
            "rarity": "legendary",
            "id": 30,
            "states": [
                {
                    "type": "massacre",
                    "trigger": "onDirectAttackHit",
                    "target": "directEnnemyCard",
                    "value": 40
                }
            ],
            "level": 1,
            "world": 2,
            "isPvp": false
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
            "hp": 24,
            "attackSpeed": 0.27748873851023215,
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
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 0.21330729007701543,
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
            "world": 2,
            "isPvp": false
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
            "hp": 93,
            "attackSpeed": 0.47515151515151516,
            "rarity": "rare",
            "id": 26,
            "states": [],
            "level": 2,
            "world": 2,
            "isPvp": false
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
            "hp": 204,
            "attackSpeed": 0.5321473480155661,
            "rarity": "rare",
            "id": 27,
            "states": [],
            "level": 2,
            "world": 2,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 127,
            "attackSpeed": 0.231648181516713,
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
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 145,
            "attackSpeed": 0.3266833329081849,
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
            "world": 1,
            "isPvp": false
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
            "hp": 67,
            "attackSpeed": 0.6772296508570781,
            "rarity": "common",
            "id": 5,
            "states": [],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "hp": 81,
            "attackSpeed": 0.6546553291618422,
            "rarity": "common",
            "id": 6,
            "states": [],
            "level": 3,
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.96,
        {
            "name": "Crabvor Preceptor",
            "cost": 5,
            "illustration": "card_7_level_3_1717535735398.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 285,
            "hp": 223,
            "attackSpeed": 0.168,
            "rarity": "common",
            "id": 7,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 0
                }
            ],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        1.96,
        {
            "name": "Queen crabvor",
            "cost": 3,
            "illustration": "card_15_level_2_1720100176579.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 47,
            "hp": 26,
            "attackSpeed": 0.9312578590272406,
            "rarity": "legendary",
            "id": 15,
            "states": [],
            "level": 2,
            "world": 1,
            "isPvp": false
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
            "hp": 866,
            "attackSpeed": 0.6873863542433761,
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
            "world": 2,
            "isPvp": false
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
            "hp": 339,
            "attackSpeed": 0.4816880733420748,
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        2.16,
        {
            "name": "Friendly Crabvor",
            "cost": 3,
            "illustration": "card_9_level_3_1719012820414.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 32,
            "hp": 106,
            "attackSpeed": 0.37274194826984525,
            "rarity": "rare",
            "id": 9,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 100
                }
            ],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "world": 1,
            "isPvp": false
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
            "hp": 381,
            "attackSpeed": 0.6633762280938321,
            "rarity": "rare",
            "id": 11,
            "states": [],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "hp": 675,
            "attackSpeed": 0.27110883423451915,
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
            "world": 1,
            "isPvp": false
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
            "attackSpeed": 0.15652475842498526,
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
            "world": 1,
            "isPvp": false
        }
    ],
    [
        2.35,
        {
            "name": "Hero Crabvor",
            "cost": 2,
            "illustration": "card_14_level_3_1720028021115.png",
            "worldIllustration": "world_1_cardBackground_1718815100412.jpeg",
            "dmg": 39,
            "hp": 62,
            "attackSpeed": 0.8916857069618196,
            "rarity": "epic",
            "id": 14,
            "states": [
                {
                    "type": "heal",
                    "trigger": "onPlacement",
                    "target": "allyCards",
                    "value": 0
                }
            ],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "attackSpeed": 0.7965701664009266,
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
            "world": 2,
            "isPvp": false
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
            "hp": 180,
            "attackSpeed": 0.3710409411372281,
            "rarity": "common",
            "id": 17,
            "states": [],
            "level": 3,
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 0.29905651639782077,
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
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 0.24872173206215817,
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        2.35,
        {
            "name": "Ragh Slave",
            "cost": 1,
            "illustration": "card_21_level_3_1724595145734.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 30,
            "hp": 118,
            "attackSpeed": 0.5610926839658489,
            "rarity": "common",
            "id": 21,
            "states": [],
            "level": 3,
            "world": 2,
            "isPvp": false
        }
    ],
    [
        2.35,
        {
            "name": "Ragh Thrower",
            "cost": 3,
            "illustration": "card_22_level_3_1724595817743.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 20,
            "hp": 186,
            "attackSpeed": 0.5600052499753908,
            "rarity": "common",
            "id": 22,
            "states": [
                {
                    "type": "massacre",
                    "trigger": "onDirectAttackHit",
                    "target": "directEnnemyCard",
                    "value": 14
                }
            ],
            "level": 3,
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 0.2842930882030022,
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
            "world": 2,
            "isPvp": false
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
            "hp": 404,
            "attackSpeed": 0.4111330684826994,
            "rarity": "legendary",
            "id": 30,
            "states": [
                {
                    "type": "massacre",
                    "trigger": "onDirectAttackHit",
                    "target": "directEnnemyCard",
                    "value": 51
                }
            ],
            "level": 2,
            "world": 2,
            "isPvp": false
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
            "hp": 29,
            "attackSpeed": 0.3051229260478472,
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
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 4.973799150320701e-16,
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
            "world": 2,
            "isPvp": false
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
            "world": 2,
            "isPvp": false
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
            "hp": 254,
            "attackSpeed": 0.593203641256525,
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
            "world": 2,
            "isPvp": false
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
            "attackSpeed": 1.1061417630665609,
            "rarity": "legendary",
            "id": 15,
            "states": [],
            "level": 3,
            "world": 1,
            "isPvp": false
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
            "hp": 1203,
            "attackSpeed": 0.8099305525784294,
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
            "world": 2,
            "isPvp": false
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
            "hp": 487,
            "attackSpeed": 0.57714055480446,
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
            "world": 2,
            "isPvp": false
        }
    ],
    [
        3.29,
        {
            "name": "King Of The Ragh",
            "cost": 6,
            "illustration": "card_30_level_3_1724595417108.png",
            "worldIllustration": "world_2_cardBackground_1724600115619.png",
            "dmg": 49,
            "hp": 566,
            "attackSpeed": 0.4864592069228416,
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
            "world": 2,
            "isPvp": false
        }
    ]
]

export default cardForTest;
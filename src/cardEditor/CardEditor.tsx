import cards, {
  CardEffects,
  CardRarity,
  CardRarityOrder,
  CardStatsInfoLevel,
  CardType,
  cardCostMultiplier,
  cardRarityMultiplier,
  cardWorldMultiplier,
  getCardStats,
  getRealStrength,
  getTargetStrength,
  testIsStrengthValid,
} from "@/cards";
import FullCard from "@/game/gui/card/FullCard";
import { Button } from "@/home/Home";
import { Worlds } from "@/home/pages/home/HomeTab";
import { cn } from "@/lib/utils";
import { range } from "lodash";
import { useState } from "react";
import Ratios from "./Ratios";

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
}

function cardStateInit(card: number): CardStat {
  const cardStats = getCardStats(card);
  return {
    name: cardStats.name,
    rarity: cardStats.rarity,
    id: cardStats.id,
    world: cardStats.world,
    attackDefenseRatio: 0.5,
    speedDamageRatio: 0.5,
    stats: cardStats.stats.map((state) => ({
      effects: state.effects,
      cost: state.cost,
    })) as [CardStatLevel, CardStatLevel, CardStatLevel],
  };
}

export default function CardEditor() {
  const [card, setCard] = useState<CardStat>(cardStateInit(1));

  function setCardLevel(level: number) {
    return (cardLevel: Partial<CardStatLevel>) => {
      setCard({
        ...card,
        stats: card.stats.map((s, i) =>
          i === level - 1 ? { ...s, ...cardLevel } : s
        ) as [CardStatLevel, CardStatLevel, CardStatLevel],
      });
    };
  }

  return (
    <div className="flex w-full items-center flex-col pt-4 gap-2">
      <div className="flex gap-2">
        <select
          value={card.id}
          onChange={(v) => {
            setCard(cardStateInit(parseInt(v.target.value)));
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.id} - {card.name}
            </option>
          ))}
        </select>
        <input
          value={card.name}
          className="border-2 border-black p-2 rounded-md"
          onChange={(v) => {
            setCard({ ...card, name: v.target.value });
          }}
        />
        <select
          value={card.rarity}
          onChange={(v) => {
            setCard({ ...card, rarity: v.target.value as CardRarity });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {CardRarityOrder.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </select>
        <select
          value={card.id}
          onChange={(v) => {
            setCard({ ...card, world: parseInt(v.target.value) });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {Worlds.map((world) => (
            <option key={world.id} value={world.id}>
              {world.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 py-4">
        <CopyButton label="Copy config" value={JSON.stringify(card)} />
      </div>
      <Ratios setCard={setCard} />

      <div className="flex gap-8">
        <CardLevel cardStats={card} setCardLevel={setCardLevel(1)} level={1} />
        <CardLevel cardStats={card} setCardLevel={setCardLevel(2)} level={2} />
        <CardLevel cardStats={card} setCardLevel={setCardLevel(3)} level={3} />
      </div>
    </div>
  );
}

interface CardLevelProps {
  cardStats: CardStat;
  setCardLevel: (card: Partial<CardStatsInfoLevel>) => void;
  level: number;
}

function cardStrengthMultiplier(card: CardStat, cost: number) {
  return (value: number) =>
    value *
    cardCostMultiplier ** (cost - 1) *
    cardRarityMultiplier[card.rarity] *
    cardWorldMultiplier ** (card.world - 1);
}

function getStats(card: CardStat, level: number) {
  const attackRatio = 1 - card.attackDefenseRatio;
  const defenseRatio = card.attackDefenseRatio;
  const speedRatio = 1 - card.speedDamageRatio;
  const cost = card.stats[level - 1].cost;

  const multiplier = cardStrengthMultiplier(card, cost);

  const dps = multiplier(25 * attackRatio) * (1.2 ** (level - 1));
  const levelDpsMult = Math.sqrt(1.2) ** (level - 1);
  const speed = 3 * levelDpsMult * speedRatio;
  return {
    hp: multiplier(100 * defenseRatio) * (1.2 ** (level - 1)),
    dmg: dps / speed,
    attackSpeed: speed,
  };
}

function cardStatsToCard(cardStats: CardStat, level: number): CardType {
  const levelStat = cardStats.stats[level - 1];
  const stats = getStats(cardStats, level);

  return {
    name: cardStats.name,
    cost: levelStat.cost,
    illustration: "",
    worldIllustration: "",
    dmg: stats.dmg,
    hp: stats.hp,
    attackSpeed: stats.attackSpeed,
    rarity: cardStats.rarity,
    id: cardStats.id,
    effects: levelStat.effects,
    level,
    world: cardStats.world,
  };
}

function CardLevel({ cardStats, setCardLevel, level }: CardLevelProps) {
  const card = cardStatsToCard(cardStats, level);

  const realStrength = getRealStrength(card);
  const targetStrength = getTargetStrength(card);
  const isStrengthValid = testIsStrengthValid(realStrength, targetStrength);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[500px] h-[350px] bg-slate-200 p-2 rounded-md grid grid-cols-[1fr_2fr] grid-rows-[repeat(15,_1fr)] gap-y-2">
        <h2 className="col-span-2 text-center pt-1 text-xl font-bold">
          Level {level}
        </h2>
        <p className="col-span-2 text-center">
          <span
            className={cn(isStrengthValid ? "text-green-500" : "text-red-500")}
          >
            {realStrength}
          </span>{" "}
          / <span className="text-blue-500">{targetStrength}</span>
        </p>
        <label>Cost: </label>
        <select
          value={card.cost}
          onChange={(v) => {
            setCardLevel({ cost: parseInt(v.target.value) });
          }}
          className="border-2 border-black p-2 rounded-md"
        >
          {range(1, 10).map((cost) => (
            <option key={cost} value={cost}>
              {cost} mana
            </option>
          ))}
        </select>
        <label>Fight Back: </label>
        <input
          type="checkbox"
          checked={!!card.effects.fightBack}
          onChange={(v) => {
            setCardLevel({
              effects: {
                ...card.effects,
                fightBack: v.target.checked ? { type: "fightBack" } : undefined,
              },
            });
          }}
        />
        <label>Multi Attack: </label>
        <input
          type="checkbox"
          checked={!!card.effects.multiAttack}
          onChange={(v) => {
            setCardLevel({
              effects: {
                ...card.effects,
                multiAttack: v.target.checked
                  ? { type: "multiAttack" }
                  : undefined,
              },
            });
          }}
        />
        <label>Placement heal: </label>
        <input
          type="checkbox"
          checked={!!card.effects.placementHeal}
          onChange={(v) => {
            setCardLevel({
              effects: {
                ...card.effects,
                placementHeal: v.target.checked
                  ? { type: "placementHeal", amount: 50 }
                  : undefined,
              },
            });
          }}
        />
        {card.effects.placementHeal && (
          <div className="border-[1px] border-black col-span-2 p-1 grid grid-cols-[1fr_2fr]">
            <label>Amount: </label>
            <input
              value={card.effects.placementHeal.amount}
              min={0}
              step={50}
              type="number"
              className="border-2 border-black p-2 rounded-md"
              onChange={(v) => {
                setCardLevel({
                  effects: {
                    ...card.effects,
                    placementHeal: {
                      ...card.effects.placementHeal!,
                      amount: parseInt(v.target.value),
                    },
                  },
                });
              }}
            />
          </div>
        )}
      </div>
      <div className="relative w-full scale-[55%] translate-x-[60px] pt-4">
        <FullCard card={card} className="pt-8" />
      </div>
    </div>
  );
}

export function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  return <Button action={copy}>{copied ? "Copied!" : label}</Button>;
}

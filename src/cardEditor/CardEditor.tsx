import {
  CardEffects,
  CardRarity,
  CardRarityOrder,
  CardStatsInfoLevel,
  CardType,
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
import { getStats } from "./getStats";
import useEditorStore from "./EditorStore";
import { useNavigate, useParams } from "react-router";

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

export default function CardEditor() {
  const { cardId: cardIdParam } = useParams();
  const navigate = useNavigate();

  const cardId = cardIdParam ? parseInt(cardIdParam) : undefined;

  const { card, updateCard, cards } = useEditorStore((state) => ({
    card: cardId ? state.getCard(cardId) : undefined,
    updateCard: state.updateCard,
    cards: state.cards,
  }));

  if (!card || !cardId) {
    return <div>Card not found</div>;
  }

  const setCard = updateCard(cardId);

  function setCardLevel(level: number) {
    return (cardLevel: Partial<CardStatLevel>) => {
      if (!card) return;
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
        <Button
          action={() => {
            navigate(`/editor`);
          }}
        >
          Go back
        </Button>
        <select
          value={card.id}
          onChange={(v) => {
            navigate(`/editor/${v.target.value}`);
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
      <div className="py-8">
        <Ratios setCard={setCard} card={card} />
      </div>

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

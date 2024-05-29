import cards, {
  CardRarity,
  CardRarityOrder,
  CardStatsInfo,
  CardStatsInfoLevel,
  getCardFromLevel,
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

export default function CardEditor() {
  const [card, setCard] = useState<CardStatsInfo>(getCardStats(1));

  function setCardLevel(level: number) {
    return (cardLevel: Partial<CardStatsInfoLevel>) => {
      setCard({
        ...card,
        stats: card.stats.map((s, i) =>
          i === level - 1 ? { ...s, ...cardLevel } : s
        ) as [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel],
      });
    };
  }

  function propagateLevel1() {
    const level1 = card.stats[0];
    setCard({
      ...card,
      stats: card.stats.map((stat, i) =>
        i === 0
          ? level1
          : {
              cost: level1.cost,
              dmg: level1.dmg * 0.6 ** i,
              hp: level1.hp * 1.2 ** i,
              attackSpeed: level1.attackSpeed * 0.6 ** i, // attack speed progression is slower
              effects: level1.effects,
            }
      ) as [CardStatsInfoLevel, CardStatsInfoLevel, CardStatsInfoLevel],
    });
  }

  return (
    <div className="flex w-full items-center flex-col pt-4 gap-2">
      <div className="flex gap-2">
        <select
          value={card.id}
          onChange={(v) => {
            setCard(getCardStats(parseInt(v.target.value)));
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
        <Button action={propagateLevel1}>Propagate level 1 stats</Button>
				<CopyButton label="Copy config" value={JSON.stringify(card)} />
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
  cardStats: CardStatsInfo;
  setCardLevel: (card: Partial<CardStatsInfoLevel>) => void;
  level: number;
}

function CardLevel({ cardStats, setCardLevel, level }: CardLevelProps) {
  const card = getCardFromLevel(cardStats, level);

  const realStrength = getRealStrength(card);
  const targetStrength = getTargetStrength(card);
  const isStrengthValid = testIsStrengthValid(realStrength, targetStrength);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[500px] h-[500px] bg-slate-200 p-2 rounded-md grid grid-cols-[1fr_2fr] grid-rows-[repeat(15,_1fr)] gap-y-2">
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
        <NumberInput
          card={card}
          setCardLevel={setCardLevel}
          property="dmg"
          label="Damage"
          step={50}
        />
        <NumberInput
          card={card}
          setCardLevel={setCardLevel}
          property="hp"
          label="Life"
          step={50}
        />
        <NumberInput
          card={card}
          setCardLevel={setCardLevel}
          property="attackSpeed"
          label="Attack speed"
          step={0.01}
        />
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
        <FullCard card={getCardFromLevel(cardStats, level)} className="pt-8" />
      </div>
    </div>
  );
}

function NumberInput({
  card,
  setCardLevel,
  property,
  label,
  step,
}: {
  card: CardStatsInfoLevel;
  setCardLevel: (card: Partial<CardStatsInfoLevel>) => void;
  property: keyof CardStatsInfoLevel;
  label: string;
  step: number;
}) {
  return (
    <>
      <label>{label}: </label>
      <input
        value={String(card[property])}
        min={0}
        step={step}
        type="number"
        className="border-2 border-black p-2 rounded-md"
        onChange={(v) => {
          setCardLevel({ [property]: parseFloat(v.target.value) || 0 });
        }}
      />
    </>
  );
}

export function CopyButton({ label, value }: { label: string; value: string }) {
	const [copied, setCopied] = useState(false);

	function copy() {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1000);
	}

	return (
		<Button action={copy}>
			{copied ? "Copied!" : label}
		</Button>
	);
}
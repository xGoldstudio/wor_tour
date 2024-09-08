import { CardStat } from "@repo/lib";

export default function Ratios({
  setCard,
  card,
}: {
  card: CardStat;
  setCard: (card: Partial<CardStat>) => void;
}) {
  return (
    <div>
      <Ratio
        ratio={card.attackDefenseRatio}
        setRatio={(ratio) => setCard({ attackDefenseRatio: ratio })}
        firstRatioLabel="Attack"
        secondRatioLabel="Defense"
      />
      <Ratio
        ratio={card.speedDamageRatio}
        setRatio={(ratio) => setCard({ speedDamageRatio: ratio })}
        firstRatioLabel="Attack Speed"
        secondRatioLabel="Damage"
      />
    </div>
  );
}

interface RatioProps {
  ratio: number;
  setRatio: (ratio: number) => void;
  firstRatioLabel: string;
  secondRatioLabel: string;
}

function Ratio({
  ratio,
  setRatio,
  firstRatioLabel,
  secondRatioLabel,
}: RatioProps) {
  const firstRatio = Math.round((1 - ratio) * 100) / 100;
  const secondRatio = Math.round(ratio * 100) / 100;

  return (
    <div className="flex gap-4">
      <label className="w-[150px]">
        {firstRatioLabel} ({firstRatio})
      </label>
      <input
        type="range"
        min={1}
        max={99.9}
        step={1}
        value={ratio * 100}
        onChange={(e) => setRatio(parseInt(e.target.value) / 100)}
      />
      <label className="w-[150px]">
        {secondRatioLabel} ({secondRatio})
      </label>
    </div>
  );
}

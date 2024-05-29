import { useEffect, useState } from "react";
import { CardStat } from "./CardEditor";

export default function Ratios({
  setCard,
}: {
  setCard: React.Dispatch<React.SetStateAction<CardStat>>;
}) {
  const [ratioAttackDefense, setRatioAttackDefense] = useState(0.5);
  const [attackSpeedDamageRatio, setAttackSpeedDamageRatio] = useState(0.5);

  useEffect(() => {
    setCard((card) => ({
      ...card,
      attackDefenseRatio: ratioAttackDefense,
      speedDamageRatio: attackSpeedDamageRatio,
    }));
  }, [ratioAttackDefense, attackSpeedDamageRatio, setCard]);

  return (
    <>
      <Ratio
        ratio={ratioAttackDefense}
        setRatio={setRatioAttackDefense}
        firstRatioLabel="Attack"
        secondRatioLabel="Defense"
      />
      <Ratio
        ratio={attackSpeedDamageRatio}
        setRatio={setAttackSpeedDamageRatio}
        firstRatioLabel="Attack Speed"
        secondRatioLabel="Damage"
      />
    </>
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


import { getStateData, healStateDefaultTest } from "game_engine";
import { EffectLayout } from "@repo/ui";
import { useState } from "react";

export default function StatesDescDebug() {
  const [x, setX] = useState(50);

  return (
    <div>
      <div className="flex gap-2 justify-center pt-8">
        <label>X:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={x}
          onChange={(v) => setX(parseInt(v.target.value))}
        />
        <p>{x}%</p>
      </div>
      <div className="w-full flex justify-center pt-8 gap-32">
        <div className="absolute" style={{ left: `${x}%` }}>
          <EffectLayout
            effect={getStateData(healStateDefaultTest)}
            size={1}
            showDesc
          />
        </div>
      </div>
    </div>
  );
}

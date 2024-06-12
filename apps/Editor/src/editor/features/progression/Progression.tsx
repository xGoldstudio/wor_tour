import { inPx } from "@repo/ui";
import React, { useMemo, useState } from "react";
import * as _ from "lodash";
import { levels, numberOfLevels, worlds } from "./ComputeProgressionLevels";

export default function Progression() {
  const [currentLevelHover, setCurrentLevelHover] = useState<null | number>(
    null
  );
  const width = 1300;
  const height = width / 2;
  const w = 10;
  const h = 2;
  const top = 20;
  const bottom = height - h;
  const worldW = width / worlds.length;
  const min = _.minBy(worlds, "minLevel")?.minLevel || 0;
  const max = _.maxBy(worlds, "maxLevel")?.maxLevel || 0;
  const range = max - min;
  const scale = (bottom - top) / range;
  function computePositionFromValue(value: number) {
    return bottom + (min - value) * scale;
  }

  function Value(x: number, y: number, value: number) {
    return (
      <>
        <rect x={x} y={y} width={w} height={h} />
        <text x={x + w + 3} y={y + 5} width={w} height={h} textAnchor="start">
          {Math.floor(value)}
        </text>
      </>
    );
  }

  function Point({ x, y, id }: { x: number; y: number; id: number }) {
    return (
      <circle
        cx={x}
        cy={y}
        r={4.5}
        fill="red"
        onMouseEnter={() => setCurrentLevelHover(id)}
        onMouseLeave={() => setCurrentLevelHover(null)}
        className="cursor-pointer"
      />
    );
  }

  const allPoints: { x: number; y: number }[] = useMemo(
    () =>
      levels.map((level) => {
        const startX = (level.world - 1) * worldW;
        const x = startX + ((level.level - 1) / numberOfLevels) * worldW;
        const y = computePositionFromValue(level.strength);
        return { x, y };
      }),
    // since levels is a const it should only trigger once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levels]
  );

  return (
    <div className="flex items-center justify-center gap-8 flex-col pt-8">
      <h2 className="text-2xl">Levels Progression</h2>
      <div className="mt-16 bg-slate-100 rounded-md p-4">
        <div className="relative">
          {currentLevelHover !== null && (
            <div
              className="absolute top-0 left-0 bg-slate-50 pointer-events-none p-2 rounded-md text-xs"
              style={{
                left: inPx(allPoints[currentLevelHover].x),
                top: inPx(allPoints[currentLevelHover].y),
                transform: "translate(-50%, calc(-100% - 10px))",
              }}
            >
              <p>Id {levels[currentLevelHover].id}</p>
              <p>World {levels[currentLevelHover].world}</p>
              <p>Level {levels[currentLevelHover].level}</p>
              <p>Strength {levels[currentLevelHover].strength}</p>
            </div>
          )}
          <svg
            style={{
              width: inPx(width),
              height: inPx(height),
            }}
            viewBox={`0 0 ${width} ${height}`}
          >
            {worlds.map((level) => {
              const startX = (level.id - 1) * worldW;
              const endY = computePositionFromValue(level.minLevel);
              const startY = computePositionFromValue(level.maxLevel);
              return (
                <React.Fragment key={level.id}>
                  <rect
                    x={startX}
                    y={startY}
                    width={worldW}
                    height={endY - startY}
                    fill={`rgba(${142}, ${175}, ${214}, ${(level.maxLevel - min) / range})`}
                  />
                  <text x={startX + worldW / 2} y={top - 5} textAnchor="middle">
                    World {level.id}
                  </text>
                  {Value(startX, startY, level.maxLevel)}
                  {Value(startX, endY, level.minLevel)}
                </React.Fragment>
              );
            })}
            {allPoints.map((point, i) => {
              const nextPoint = allPoints[i + 1];

              return (
                <React.Fragment key={`${point.x}_${point.y}`}>
                  {nextPoint && (
                    <line
                      x1={point.x}
                      y1={point.y}
                      x2={nextPoint.x}
                      y2={nextPoint.y}
                      stroke="green"
                    />
                  )}
                  <Point key={i} x={point.x} y={point.y} id={i} />
                </React.Fragment>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

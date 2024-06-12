import { cubicBezier, getStrengthMax, getStrengthMin, inPx } from "@repo/ui";
import React, { useState } from "react";
import * as _ from "lodash";

interface Level {
  id: number;
  minLevel: number;
  maxLevel: number;
}

function buildLevel(word: number) {
  return {
    id: word,
    minLevel: getStrengthMin(word),
    maxLevel: getStrengthMax(word),
  };
}

export default function Progression() {
  const [levels, setLevels] = useState<Level[]>(_.range(1, 6).map(buildLevel));
  const [currentLevelHover, setCurrentLevelHover] = useState<null | number>(
    null
  );
  const [numberOfLevels, setNumberOfLevels] = useState(20);
  const width = 1300;
  const height = width / 2;
  const w = 10;
  const h = 2;
  const top = 20;
  const bottom = height - h;
  const worldW = width / levels.length;
  const min = _.minBy(levels, "minLevel")?.minLevel || 0;
  const max = _.maxBy(levels, "maxLevel")?.maxLevel || 0;
  const range = max - min;
  const scale = (bottom - top) / range;

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

  const allPoints: { x: number; y: number }[] = [];

  const endPercentage = 0.45;
  const beginPercentage = 0.06;
  const gapPercentage = (1 - endPercentage) / (levels.length - 1);

  levels.forEach((level) => {
    const startX = (level.id - 1) * worldW;
    const startY = bottom + (min - level.minLevel) * scale;
    const endY = bottom + (min - level.maxLevel) * scale;

    // world 1 have a different begin percentage and a different easing
    const computedBeginPercentage =
      (level.id > 1 ? beginPercentage : 0) + gapPercentage * (level.id - 1);
    const computedEndPercentage =
      endPercentage + gapPercentage * (level.id - 1);

    const ajustedStartY = startY - (startY - endY) * computedBeginPercentage;
    const ajustedEndY = endY + (startY - endY) * (1 - computedEndPercentage);

    const worldRange = ajustedStartY - ajustedEndY;
    const worldScale = worldRange / (numberOfLevels - 1);

    const getProgress = (i: number) => {
      const t =
        level.id === 1
          ? cubicBezier(i / numberOfLevels, 0, 0.1, 0.3, 1)
          : cubicBezier(i / numberOfLevels, 0, 0.5, 0.2, 1);
      return Math.min(t * numberOfLevels, numberOfLevels - 1);
    };
    {
      _.range(numberOfLevels).map((i) => {
        const x = startX + (i / numberOfLevels) * worldW;
        let y = ajustedStartY - worldScale * getProgress(i);
        if (i + 1 === numberOfLevels / 2) {
          y =
            ajustedStartY -
            worldScale * getProgress(i + (level.id === 1 ? 2 : 3));
        } else if (i + 1 === numberOfLevels) {
          y = ajustedEndY;
        }
        allPoints.push({ x, y });
      });
    }
  });

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
              <p>World {Math.ceil(currentLevelHover / numberOfLevels)}</p>
              <p>Level {(currentLevelHover % numberOfLevels) + 1}</p>
              <p>Strength {1}</p>
            </div>
          )}
          <svg
            style={{
              width: inPx(width),
              height: inPx(height),
            }}
            viewBox={`0 0 ${width} ${height}`}
          >
            {levels.map((level) => {
              const startX = (level.id - 1) * worldW;
              const endY = bottom + (min - level.minLevel) * scale;
              const startY = bottom + (min - level.maxLevel) * scale;
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
                <>
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
                </>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

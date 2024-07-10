import {
  BoosterRarityDrop,
  formatTime,
  inPx,
  levels, unlockedIndex,
  worlds
} from "@repo/ui";
import React, { useMemo, useState } from "react";
import * as _ from "lodash";
import { numberOfLevels } from "./consts";
import { Link } from "react-router-dom";
import { BoosterTypeDeclartion } from "@repo/types";

export default function Progression() {
  const [currentLevelHover, setCurrentLevelHover] = useState<null | number>(
    null
  );
  const [currentUnlockBoosterHover, setCurrentUnlockBoosterHover] =
    useState<null | {
      booster: BoosterTypeDeclartion;
      coords: { x: number; y: number };
    }>(null);
  const padding = 15;
  const width = 1300 + padding * 2;
  const height = width / 2 + padding * 2;
  const w = 10;
  const h = 2;
  const top = 20 + padding;
  const left = padding;
  const bottom = height - h - padding;
  const worldW = (width - padding * 2) / worlds.length;
  const min = _.minBy(worlds, "minLevel")?.minLevel || 0;
  const max = _.maxBy(worlds, "maxLevel")?.maxLevel || 0;
  const range = max - min;
  const scale = (bottom - top) / range;
  function computePositionFromValue(value: number) {
    return bottom + (min - value) * scale;
  }

  function getX(world: number) {
    return left + (world - 1) * worldW;
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
        const startX = getX(level.world);
        const x = startX + ((level.level - 1) / numberOfLevels) * worldW;
        const y = computePositionFromValue(level.strength);
        return { x, y };
      }),
    // since levels is a const it should only trigger once
    [levels]
  );

  return (
    <div className="flex items-center justify-center gap-8 flex-col pt-8">
      <div className="mt-16 bg-slate-100 rounded-md">
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
              <p>
                Trophies Range {levels[currentLevelHover].trophyStart} -{" "}
                {levels[currentLevelHover].trophyEnd}
              </p>
              <div className="w-full h-[1px] bg-black my-1" />
              <p>Gold: {levels[currentLevelHover].reward.gold}</p>
              <p>Xp: {levels[currentLevelHover].reward.xp}</p>∏
              <p>Booster: {levels[currentLevelHover].reward.booster?.name}</p>
            </div>
          )}
          {currentUnlockBoosterHover !== null && (
            <div
              className="absolute top-0 left-0 bg-slate-50 pointer-events-none p-2 rounded-md text-xs"
              style={{
                left: inPx(currentUnlockBoosterHover.coords.x),
                top: inPx(currentUnlockBoosterHover.coords.y),
                transform: "translate(-50%, calc(-100% - 10px))",
              }}
            >
              <p className="font-bold">
                {currentUnlockBoosterHover.booster.name}
              </p>
              <p>{currentUnlockBoosterHover.booster.description}</p>
              <p>Cost: {currentUnlockBoosterHover.booster.cost}</p>
              <p>
                Worlds: [
                {currentUnlockBoosterHover.booster.contain.worlds.join(",")}]
              </p>
              {currentUnlockBoosterHover.booster.purchaseDelayInMs !==
                undefined && (
                <p>
                  Purchase Delay:{" "}
                  {formatTime(
                    currentUnlockBoosterHover.booster.purchaseDelayInMs
                  )}
                </p>
              )}
              <div className="flex items-center w-full gap-2">
                <p>Rarities Drop:</p>
                <div className="w-[200px] h-[16px] bg-slate-500 p-[2px] px-1 rounded-sm">
                  <BoosterRarityDrop
                    booster={currentUnlockBoosterHover.booster}
                  />
                </div>
              </div>
            </div>
          )}
          <svg
            style={{
              width: inPx(width),
              height: inPx(height),
            }}
            viewBox={`0 0 ${width} ${height}`}
          >
            {worlds.map((world) => {
              const startX = getX(world.id);
              const endY = computePositionFromValue(world.minLevel);
              const startY = computePositionFromValue(world.maxLevel);
              return (
                <React.Fragment key={world.id}>
                  <rect
                    x={startX}
                    y={startY}
                    width={worldW}
                    height={endY - startY}
                    fill={`rgba(${142}, ${175}, ${214}, ${(world.maxLevel - min) / range})`}
                  />
                  <Link
                    to={`/${world.id}`}
                    className="hover:underline decoration-solid py-1"
                  >
                    <text
                      x={startX + worldW / 2}
                      y={top - 5}
                      textAnchor="middle"
                    >
                      World {world.id}
                    </text>
                  </Link>
                  {Value(startX, startY - h / 2, world.maxLevel)}
                  {Value(startX, endY - h / 2, world.minLevel)}
                </React.Fragment>
              );
            })}
            {allPoints.map((point, i) => {
              const nextPoint = allPoints[i + 1];
              const unlockedBoosters = unlockedIndex[levels[i].id] || [];

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
                  {unlockedBoosters.map((booster, i) => {
                    const coords = {
                      x: point.x,
                      y: point.y - (i + 1) * 20,
                    };
                    return (
                      <circle
                        onMouseEnter={() =>
                          setCurrentUnlockBoosterHover({ booster, coords })
                        }
                        onMouseLeave={() => setCurrentUnlockBoosterHover(null)}
                        key={booster.name}
                        cx={coords.x}
                        cy={coords.y}
                        r={4.5}
                        fill="blue"
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

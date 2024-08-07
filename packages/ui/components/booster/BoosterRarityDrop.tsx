import React from "react";
import { BoosterTypeDeclartion, textureByRarity } from "@repo/lib";
import { allRarites } from "../../data/ComputeBoosterProgress";

export default function BoosterRarityDrop({
  booster,
}: {
  booster: BoosterTypeDeclartion;
}) {
  return (
    <div className="w-full h-full flex gap-1 relative group">
      {allRarites.map((rarity) => (
        <React.Fragment key={rarity}>
          {booster.contain.rarities[rarity] ? (
            <div
              className="h-full rounded-sm relative overflow-hidden bg-slate-800 transition-transform"
              style={{
                width: `${booster.contain.rarities[rarity]}%`,
              }}
            >
              <div
                className="absolute w-full h-full top-0 left-0 blur-[2px]"
                style={{
                  backgroundImage: `url(${textureByRarity(rarity)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </React.Fragment>
      ))}
      <BoosterRariryDropModal booster={booster} />
    </div>
  );
}

function BoosterRariryDropModal({
  booster,
}: {
  booster: BoosterTypeDeclartion;
}) {
  return (
    <div className="flex flex-col items-center text-left absolute bottom-0 left-0 z-10 translate-y-full opacity-0 group-hover:opacity-100 drop-shadow-[1px_2px_2px_black]">
      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-slate-50" />
      <div className="p-2 rounded-sm bg-slate-50">
        {allRarites.map((rarity) => (
          <React.Fragment key={rarity}>
            {booster.contain.rarities[rarity] ? (
              <p className="capitalize">
                {rarity}: {`${Math.floor(booster.contain.rarities[rarity])}%`}
              </p>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

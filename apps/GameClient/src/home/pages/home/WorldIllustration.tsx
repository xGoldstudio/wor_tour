import usePlayerStore from "@/home/store/playerStore";
import { Cover, EmptyBar } from "@repo/ui";
import { getImageUrl, textureByRarity } from "@repo/lib";
import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "../../../../../../packages/ui/components/card/CardBorder";
import _ from "lodash";
import useDataStore from "@/cards/DataStore";
import { useState } from "react";

export default function WorldIllustration({
  setWorldsModalOpen,
}: {
  setWorldsModalOpen: () => void;
}) {
  const { currentWorld } = usePlayerStore((state) => ({
    trophies: state.trophies,
    currentWorld: state.currentWorld,
  }));
  const worlds = useDataStore((state) => state.worlds);
  const [lastUsingWorld, setLastUsingWorld] = useState(currentWorld);
  if (lastUsingWorld !== currentWorld) {
    setLastUsingWorld(currentWorld);
    // trigger animation
  }

  return (
    <div className="relative w-1/2" onClick={setWorldsModalOpen}>
      <img
        id="worldIllustration"
        className="w-full aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)]"
        src={getImageUrl(worlds[currentWorld - 1].illustration)}
      />
      <CurrentWorldProgress />
      {lastUsingWorld !== currentWorld && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />
      )}
    </div>
  );
}

function CurrentWorldProgress() {
  const { currentWorld, currentTrophies, maxTrophies, rewardToCollect } =
    usePlayerStore((state) => ({
      currentWorld: state.currentWorld,
      currentTrophies: state.trophies,
      maxTrophies: state.maxTrophies,
      // get the amount of rewards to collect
      rewardToCollect: [...state.tiers.values()].reduce((acc, tier) => {
        if (!tier.isWorld && tier.isUnlocked && !tier.isOpen) {
          return acc + 1;
        }
        return acc;
      }, 0),
    }));

  const trophiesMin = (currentWorld - 1) * 1000;
  const trophiesMax = currentWorld * 1000;
  const diffTrophies = trophiesMax - trophiesMin;
  const progressPercent =
    ((currentTrophies - trophiesMin) / diffTrophies) * 100;

  const maxTrophiesProgressPercent =
    ((maxTrophies - trophiesMin) / diffTrophies) * 100;

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md">
      <img
        src="/trophy.png"
        className="absolute z-10 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] drop-shadow-[2px_1px_1px_black]"
      />
      {rewardToCollect > 0 && (
        <div className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2">
          <div className="w-[20px] h-[20px] bg-slate-200 rounded-sm overflow-hidden flex items-center justify-center">
            <div className="w-[calc(100%_+_3px)] h-[calc(100%_+_3px)] absolute top-[-1.5px] left-[-1.5px] blur-[2px] rounded-sm  bg-amber-100 animate-[shiny_2s_ease-in-out_infinite]"></div>
            <Cover cardRarity="epic" />
            <p className="text-sm z-10 text-slate-100">{rewardToCollect}</p>
          </div>
        </div>
      )}
      <Borders width={170} height={32} borderUnit={0.5} rarity={"rare"}>
        <CardIllustartion width={170} height={32} borderUnit={0.5}>
          <InnerBord size={0.5}>
            <div className="w-full h-full relative overflow-hidden">
              <EmptyBar>
                <div
                  className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left brightness-200 opacity-30"
                  style={{
                    transform: `scaleX(${maxTrophiesProgressPercent}%)`,
                  }}
                />
                <div
                  className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left brightness-125 transition-transform"
                  style={{ transform: `scaleX(${progressPercent}%)` }}
                />
              </EmptyBar>
            </div>
            <svg className="absolute top-0 left-0" viewBox="0 0 100 14">
              <mask id="trophiesMask">
                {_.range(9).map((i) => (
                  <rect
                    key={i}
                    x={(i + 1) * 10}
                    y={0}
                    width={1}
                    height={14}
                    fill="white"
                  />
                ))}
              </mask>
              <rect
                fill="black"
                x={0}
                y={0}
                width="100%"
                height="100%"
                mask="url(#trophiesMask)"
              />
              <image
                className="blur-[6px]"
                href={textureByRarity("rare")}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#trophiesMask)"
              />
            </svg>
          </InnerBord>
        </CardIllustartion>
      </Borders>
    </div>
  );
}

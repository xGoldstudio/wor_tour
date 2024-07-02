import usePlayerStore from "@/home/store/playerStore";
import { useContext, useRef } from "react";
import { AllWorldsAnimationContext, AllWorldsAnimationContextType } from "./trophyBar/TrophyBarContext";
import { useGSAP } from "@gsap/react";
import { Button, cn } from "@repo/ui";
import Cover from "@/home/ui/Cover";
import gsap from "gsap";

const glowChestImageByLevel = {
  common: "/chests/common_yellow_glow.png",
  rare: "/chests/rare_yellow_glow.png",
  epic: "/chests/mythical_yellow_glow.png",
};

const chestImageByLevel = {
  common: "/chests/common_no_glow.png",
  rare: "/chests/rare_no_glow.png",
  epic: "/chests/mythical_no_glow.png",
};

const emptyChestImageByLevel = {
  common: "/chests/common_empty_no_glow.png",
  rare: "/chests/rare_empty_no_glow.png",
  epic: "/chests/mythical_empty_no_glow.png",
};

export default function LevelPreview({
  i,
  worldTrophies,
}: {
  i: number;
  worldTrophies: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const levelTrophies = worldTrophies + i * 100;
  const { maxTrophies, isToCollect, collectReward } = usePlayerStore(
    (state) => ({
      maxTrophies: state.maxTrophies,
      isToCollect: state.getIsToCollectTrophiesReward(levelTrophies),
      collectReward: () => state.collectedTrophiesReward(levelTrophies),
    })
  );
  const { appearedTrophiesFields } = useContext(AllWorldsAnimationContext) as AllWorldsAnimationContextType;

  const isUnlocked = levelTrophies <= maxTrophies;
  const isEmpty = isUnlocked && !isToCollect;

  useGSAP(() => {
    if (isToCollect && appearedTrophiesFields.has(levelTrophies) && ref.current) {
      gsap.to(
        ref.current,
        {
          scale: 1.05,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        }
      )
    }
  }, { dependencies: [appearedTrophiesFields, ref, isToCollect], revertOnUpdate: true})

  return (
    <div
      x-data-trophies={levelTrophies}
      className={cn(
        "trophiesField levelTrophiesField",
        "flex justify-center items-center relative h-[80px] w-[350px] opacity-0",
        !isUnlocked && "grayscale-[80%]"
      )}
      onClick={isToCollect ? collectReward : () => {}}
      ref={ref}
    >
      <div className="absolute w-full h-full bg-slate-400 opacity-60 rounded-md" />
      <div
        className={cn(
          "absolute w-full h-full rounded-md",
        )}
        style={{
          backgroundImage: `url(homeBg.jpeg)`,
          backgroundSize: "100%",
          backgroundPositionY: `${100 - i * 10}%`,
        }}
      ></div>
      <div
        className={cn(
          "flex items-center flex-col gap-2 absolute top-[-20px]",
          i % 2 ? "right-[50px]" : "left-[50px]"
        )}
      >
        <div className={cn("rounded-sm overflow-hidden relative")}>
          <Cover cardRarity="rare" className="opacity-80 bg-slate-50" />
          <img
            src={
              isEmpty
                ? emptyChestImageByLevel["rare"]
                : chestImageByLevel["rare"]
            }
            alt="chest"
            className="left-0 top-0 w-[80px] aspect-square relative"
          />
          {isToCollect && (
            <img
              src={glowChestImageByLevel["rare"]}
              alt="chest"
              className="left-0 top-0 w-[80px] aspect-square absolute animate-[shiny_2s_ease-in-out_infinite]"
            />
          )}
        </div>
        {isToCollect && (
          <Button
            action={() => {}}
            rarity="epic"
            full
            small
            className="text-slate-100"
          >
            Collect
          </Button>
        )}
      </div>
    </div>
  );
}

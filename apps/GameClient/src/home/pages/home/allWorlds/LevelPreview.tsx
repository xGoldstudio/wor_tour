import usePlayerStore from "@/home/store/playerStore";
import { useContext, useRef } from "react";
import {
  AllWorldsAnimationContext,
  AllWorldsAnimationContextType,
} from "./trophyBar/TrophyBarContext";
import { useGSAP } from "@gsap/react";
import { Button, cn } from "@repo/ui";
import Cover from "@/home/ui/Cover";
import gsap from "gsap";
import { Tier } from "@/home/store/tiers";
import useCollectTierReward from "./useCollectTierReward";

const glowChestImageByLevel = {
  common: "/chests/common_yellow_glow.png",
  rare: "/chests/rare_yellow_glow.png",
  epic: "/chests/mythical_yellow_glow.png",
};

export const chestImageByLevel = {
  common: "/chests/common_no_glow.png",
  rare: "/chests/rare_no_glow.png",
  epic: "/chests/mythical_no_glow.png",
};

export const emptyChestImageByLevel = {
  common: "/chests/common_empty_no_glow.png",
  rare: "/chests/rare_empty_no_glow.png",
  epic: "/chests/mythical_empty_no_glow.png",
};

export default function LevelPreview({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLDivElement>(null);
  const { appearedTrophiesFields, state } = useContext(
    AllWorldsAnimationContext
  ) as AllWorldsAnimationContextType;
  const isLast = usePlayerStore((state) => state.currentTier) === tier.tier;
  const collectReward = useCollectTierReward(tier.tier);
  const isAnimationFired = useRef(false);
  const isToCollect = tier.isUnlocked && !tier.isOpen;

  useGSAP(
    () => {
      if (
        appearedTrophiesFields.has(tier.beginTrophies) &&
        isToCollect &&
        ref.current &&
        isAnimationFired.current === false
      ) {
        isAnimationFired.current = true;
        setTimeout(() => {
          const animation = () => {
            gsap.to(ref.current, {
              scale: 1.05,
              duration: 2,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            });
          };
          if (isLast && state === "tier") {
            // is last
            const tl = gsap.timeline({
              onComplete: () => {
                animation();
              },
            });
            tl.fromTo(
              ref.current,
              {
                scale: 1,
              },
              {
                scale: 1.2,
                duration: 1,
                ease: "elastic.inOut",
              }
            )
              .fromTo(
                ref.current!.querySelector(".lastTierUnlocked"),
                {
                  opacity: 1,
                  scale: 0,
                },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 1,
                  ease: "elastic.inOut",
                }
              )
              .to(ref.current, {
                scale: 1,
                duration: 1,
                ease: "elastic.inOut",
              });
          } else {
            animation();
          }
        }, 0);
      }
    },
    {
      dependencies: [appearedTrophiesFields, ref, isToCollect],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      x-data-trophies={tier.beginTrophies}
      className={cn(
        "trophiesField levelTrophiesField",
        "flex justify-center items-center relative h-[80px] w-[350px] opacity-0",
        !tier.isUnlocked && "grayscale-[80%]",
        isLast && state === "tier" && "z-10"
      )}
      onClick={isToCollect ? collectReward : () => {}}
      ref={ref}
    >
      <div className="absolute w-full h-full bg-slate-400 opacity-60 rounded-md" />
      <div
        className={cn("absolute w-full h-full rounded-md")}
        style={{
          backgroundImage: `url(homeBg.jpeg)`,
          backgroundSize: "100%",
          backgroundPositionY: `${100 - (tier.tier % 10) * 10}%`,
        }}
      ></div>
      <div
        className={cn(
          "flex items-center flex-col gap-2 absolute top-[-20px]",
          tier.tier % 2 ? "right-[50px]" : "left-[50px]",
          isLast && state === "tier" && "opacity-0 lastTierUnlocked"
        )}
      >
        <div className={cn("rounded-sm overflow-hidden relative")}>
          <Cover cardRarity="rare" className="opacity-80 bg-slate-50" />
          <img
            src={
              tier.isUnlocked && tier.isOpen
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

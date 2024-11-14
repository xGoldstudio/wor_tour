import { findCard } from "@/cards";
import CardDisplay from "@/game/gui/card/FullCard";
import { CardRewardType } from "@/home/store/rewardStore";
import { useEffect, useRef } from "react";
import _ from "lodash";
import gsap from "gsap";
import { getImageUrl, ICONS } from "@repo/lib";
import { cn } from "@repo/ui";
import { getShardsFromLevel } from "game_engine";

interface RewardProps {
  reward: CardRewardType;
  removeCurrentReward: () => void;
}

export default function CardReward({
  reward,
  removeCurrentReward,
}: RewardProps) {
  const cardRef = useRef(null);
  const evolutionCardRef = useRef(null);
  const shinyRef = useRef(null);
  const shardRef = useRef<HTMLImageElement | null>(null);
  const animationOver = useRef(false);

  const animationType = getAnimationType(reward.shardTargetIndex);

  const card = findCard(reward.cardId, reward.level);
  const evolvedCard =
    animationType === "evolution"
      ? findCard(reward.cardId, reward.level + 1)
      : null;

  function getAnimationType(target: number | null) {
    if (target === null) {
      return "newCard";
    }
    const requiredShard = getShardsFromLevel(reward.level);
    return target + 1 === requiredShard ? "evolution" : "shard";
  }

  function getAnimationLabel() {
    switch (animationType) {
      case "newCard":
        return "New Card unlocked!";
      case "evolution":
        return "Card evolved!";
      case "shard":
        return "New shard added!";
    }
  }

  function getAnimationDuration() {
    switch (animationType) {
      case "newCard":
        return 1;
      case "shard":
        return 2.4;
      case "evolution":
        return 3.4;
    }
  }

  useEffect(() => {
    if (
      !cardRef.current ||
      !shinyRef.current ||
      !shardRef.current ||
      !evolutionCardRef
    )
      return;

    const tl = gsap.timeline({
      onComplete: () => {
        animationOver.current = true;
      },
    });
    const shardTargetBounding = document.getElementById(
      `shard_${reward.shardTargetIndex}`
    )?.getBoundingClientRect();
    tl.set(cardRef.current, { scale: 0 });
    tl.progress(1).progress(0);
    tl.to(cardRef.current, { scale: 1.1, duration: 0.2 });
    tl.to(cardRef.current, { scale: 0.9, duration: 0.2 });
    tl.to(cardRef.current, { scale: 1, duration: 0.1 });

    if (reward.shardTargetIndex !== null) {
      if (!shardTargetBounding || !shardRef.current) return;
      tl.set(shardRef.current, {
        scale: 20,
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        opacity: 0,
      });
      tl.to(shardRef.current, { opacity: 1, duration: 0.25 });
      tl.to(shardRef.current, {
        scale: 1,
        top: shardTargetBounding.top - 1,
        left: shardTargetBounding.left - 1,
        duration: 1.5,
        ease: "bounce",
      });
    }
    if (animationType === "evolution") {
      tl.to(
        evolutionCardRef.current,
        { x: 0, duration: 1, ease: "bounce" },
        "evolution"
      );
      tl.to(
        evolutionCardRef.current,
        { opacity: 1, duration: 0.5 },
        "evolution"
      );

      tl.to(cardRef.current, { x: 0, opacity: 0, duration: 0.5 }, "evolution");
      tl.to(shardRef.current, { x: 0, opacity: 0, duration: 0.5 }, "evolution");
    }
    tl.fromTo(
      shinyRef.current,
      { opacity: 1, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4 },
      "preview"
    );
    gsap.to(shinyRef.current, {
      rotate: 360,
      duration: 40,
      repeat: -1,
      ease: "linear",
    });
  }, [
    cardRef,
    shinyRef,
    shardRef,
    evolutionCardRef,
    animationType,
    reward.shardTargetIndex,
  ]);

  return (
    <>
      <img
        src={getImageUrl(ICONS, "ruby.png")}
        className="w-4 h-4 bg-transparent drop-shadow-[1px_1px_1px_black] fixed z-10 opacity-0"
        ref={shardRef}
      />
      <div
        className="w-full h-full relative flex flex-col gap-4"
        onClick={() => {
          if (animationOver.current) {
            removeCurrentReward();
          }
        }}
      >
        <div className="relative w-full h-full px-8 flex items-center pt-16 flex-col gap-16">
          <div className="relative flex items-center flex-col gap-12 w-[320px]">
            <ShowTitle
              title={getAnimationLabel()}
              delay={getAnimationDuration()}
              className="z-10"
            />
            <div className="relative">
              <div
                className="w-full h-full absolute origin-center blur-[1px] scale-0"
                ref={shinyRef}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="absolute top-0 left-1/2 h-full -translate-x-1/2 drop-shadow-[0px_0px_15px_white] scale-[200%]"
                >
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="40%" stopColor="white" stopOpacity={0} />
                      <stop offset="60%" stopColor="white" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="white" />
                    </linearGradient>
                    <linearGradient
                      id="legendaryGradient"
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="40%" stopColor="#DFFCD3" stopOpacity={0} />
                      <stop
                        offset="60%"
                        stopColor="#1D7BFA"
                        stopOpacity={0.5}
                      />
                      <stop offset="100%" stopColor="#F02BD4" />
                    </linearGradient>
                  </defs>

                  {_.range(8).map((index) => (
                    <polygon
                      key={index}
                      points="50,50 10,0 0,10"
                      fill={`url(${
                        card.rarity !== "legendary"
                          ? "#gradient"
                          : "#legendaryGradient"
                      })`}
                      transform={`rotate(${index * (360 / 8)} 50 50)`}
                    />
                  ))}
                </svg>
              </div>
              <div className="relative h-[445px] flex" ref={cardRef}>
                <CardDisplay
                  card={card}
                  position={0}
                  cardData={{
                    id: reward.cardId,
                    level: reward.level,
                    shard:
                      reward.shardTargetIndex !== null
                        ? reward.shardTargetIndex
                        : 0,
                  }}
                />
              </div>
              <div
                className="absolute translate-x-[115%] w-[320px] opacity-0 top-0"
                ref={evolutionCardRef}
              >
                {evolvedCard && (
                  <CardDisplay
                    card={evolvedCard}
                    position={0}
                    cardData={{
                      id: reward.cardId,
                      level: reward.level + 1,
                      shard: 0,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ShowTitle({ title, delay, className }: { title: string; delay?: number, className?: string }) {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.set(ref.current.getElementsByTagName("span"), { y: -100, opacity: 0 });
    gsap.to(ref.current.getElementsByTagName("span"), {
      delay: delay || 0,
      y: 0,
      opacity: 1,
      stagger: 0.03,
    });
  }, [delay, ref]);

  return (
    <h1 className={cn("text-5xl text-nowrap flex font-semibold text-white", className)} ref={ref}>
      {title.split("").map((letter, index) =>
        letter === " " ? (
          <div className="w-4" key={index}></div>
        ) : (
          <span key={index} className="relative block">
            {letter}
          </span>
        )
      )}
    </h1>
  );
}

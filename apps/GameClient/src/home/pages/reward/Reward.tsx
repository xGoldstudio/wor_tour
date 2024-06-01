import { Button, Header } from "@/home/Home";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as _ from "lodash";
import { findCard } from "@/cards";
import useRewardStore, { RewardType } from "@/home/store/rewardStore";
import FullCard from "@/game/gui/card/FullCard";

interface RewardProps {
  shardTargetIndex: number | null;
  cardId: number;
  level: number;
  removeCurrentReward: () => void;
}

export default function Reward({
  shardTargetIndex,
  level,
  cardId,
  removeCurrentReward,
}: RewardProps) {
  const cardRef = useRef(null);
  const evolutionCardRef = useRef(null);
  const buttonRef = useRef(null);
  const shinyRef = useRef(null);
  const shardRef = useRef<HTMLImageElement | null>(null);

  const animationType = getAnimationType(shardTargetIndex);

  const card = findCard(cardId, level);
  const evolvedCard =
    animationType === "evolution" ? findCard(cardId, level + 1) : null;

  function getAnimationType(target: number | null) {
    if (target === null) {
      return "newCard";
    }
    const requiredShard = level === 1 ? 3 : 7;
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
        return 2;
      case "shard":
        return 3.4;
      case "evolution":
        return 6.4;
    }
  }

  useEffect(() => {
    if (
      !cardRef.current ||
      !buttonRef.current ||
      !shinyRef.current ||
      !shardRef.current ||
      !evolutionCardRef
    )
      return;
    const tl = gsap.timeline({});
    tl.to(cardRef.current, { scale: 0, duration: 0 });
    tl.to(cardRef.current, { scale: 1.1, duration: 0.4 });
    tl.to(cardRef.current, { scale: 0.9, duration: 0.3 });
    tl.to(cardRef.current, { scale: 1, duration: 0.2 });

    if (animationType === "evolution") {
      tl.to(
        evolutionCardRef.current,
        { x: 0, duration: 1, delay: 3, ease: "bounce" },
        "evolution",
      );
      tl.to(
        evolutionCardRef.current,
        { opacity: 1, duration: 0.5, delay: 3 },
        "evolution",
      );

      tl.to(
        cardRef.current,
        { x: 0, opacity: 0, duration: 0.5, delay: 3 },
        "evolution",
      );
      tl.to(
        shardRef.current,
        { x: 0, opacity: 0, duration: 0.5, delay: 3 },
        "evolution",
      );
    }

    tl.fromTo(
      buttonRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4 },
      "preview",
    );
    tl.fromTo(
      shinyRef.current,
      { opacity: 1, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4 },
      "preview",
    );
    gsap.to(shinyRef.current, {
      rotate: 360,
      duration: 40,
      repeat: -1,
      ease: "linear",
    });
    tl.pause();
    setTimeout(() => {
      tl.resume();
    }, 1000);

    if (shardTargetIndex !== null) {
      setTimeout(() => {
        const shardTarget = document.getElementById(
          `shard_${shardTargetIndex}`,
        );
        if (!shardTarget || !shardRef.current) return;
        const tl = gsap.timeline({});
        tl.set(shardRef.current, {
          scale: 20,
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          opacity: 0,
        });
        tl.to(shardRef.current, { opacity: 1, duration: 0.5 });
        tl.to(shardRef.current, {
          scale: 1,
          top: shardTarget.getBoundingClientRect().top - 1,
          left: shardTarget.getBoundingClientRect().left - 1,
          duration: 2,
          ease: "bounce",
        });
      }, 2000);
    }
  }, [
    cardRef,
    buttonRef,
    shinyRef,
    shardRef,
    evolutionCardRef,
    animationType,
    shardTargetIndex,
  ]);

  return (
    <div className="w-full h-full absolute z-10">
      <img
        src="/ruby.png"
        className="w-4 h-4 bg-transparent drop-shadow-[1px_1px_1px_black] fixed z-10 opacity-0"
        ref={shardRef}
      />
      <div
        className="w-full h-full absolute brightness-75"
        style={{
          backgroundImage: "url('/homeBg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full h-full absolute bg-[linear-gradient(0deg,_rgba(226,232,240,0.2)_0%,_rgba(226,232,240,0)_100%),_linear-gradient(0deg,_rgba(226,232,240,0)_50%,_rgba(226,232,240,1)_70%)]" />
      </div>
      <div
        className="w-full h-full absolute origin-center blur-[1px] scale-0"
        ref={shinyRef}
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute top-0 left-1/2 h-full -translate-x-1/2 drop-shadow-[0px_0px_15px_white] scale-150"
        >
          <defs>
            <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="40%" stopColor="white" stopOpacity={0} />
              <stop offset="60%" stopColor="white" stopOpacity={0.5} />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
            <linearGradient id="legendaryGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="40%" stopColor="#DFFCD3" stopOpacity={0} />
              <stop offset="60%" stopColor="#1D7BFA" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#F02BD4" />
            </linearGradient>
          </defs>

          {_.range(8).map((index) => (
            <polygon
              key={index}
              points="50,50 10,0 0,10"
              fill={`url(${
                card.rarity !== "legendary" ? "#gradient" : "#legendaryGradient"
              })`}
              transform={`rotate(${index * (360 / 8)} 50 50)`}
            />
          ))}
        </svg>
      </div>
      <div className="w-full h-full relative flex flex-col gap-4">
        <Header />
        <div className="relative w-full h-full px-8 flex items-center pt-16 flex-col gap-16">
          <div className="relative flex items-center flex-col gap-12 w-[320px]">
            <ShowTitle
              title={getAnimationLabel()}
              delay={getAnimationDuration()}
            />
            <div className="relative">
              <div className="relative h-[445px] scale-0 flex" ref={cardRef}>
                <FullCard
                  card={card}
                  position={0}
                  cardData={{
                    id: cardId,
                    level: level,
                    shard: shardTargetIndex !== null ? shardTargetIndex : 0,
                  }}
                />
              </div>
              <div
                className="absolute translate-x-[115%] w-[320px] opacity-0 top-0"
                ref={evolutionCardRef}
              >
                {evolvedCard && (
                  <FullCard
                    card={evolvedCard}
                    position={0}
                    cardData={{ id: cardId, level: level + 1, shard: 0 }}
                  />
                )}
              </div>
            </div>

            <div className="w-full" ref={buttonRef}>
              <Button action={removeCurrentReward} full>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowTitle({ title, delay }: { title: string; delay?: number }) {
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
    <h1 className="text-5xl text-nowrap font-stylised flex" ref={ref}>
      {title.split("").map((letter, index) =>
        letter === " " ? (
          <div className="w-4" key={index}></div>
        ) : (
          <span key={index} className="relative block">
            {letter}
          </span>
        ),
      )}
    </h1>
  );
}

function RewardSection({
  shardTargetIndex,
  cardId,
  level,
  removeCurrentReward,
}: RewardProps) {
  const door1 = useRef(null);
  const door2 = useRef(null);
  const [transitionReady, setTransitionReady] = useState(false);

  useEffect(() => {
    if (!door1.current || !door2.current) return;
    if (transitionReady) {
      return;
    }
    const tl = gsap.timeline({});
    tl.fromTo(door1.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    tl.fromTo(door2.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    tl.to(door1.current, { scaleX: 0, duration: 1 }, 1.5);
    tl.to(door2.current, { scaleX: 0, duration: 1 }, 1.5);
    setTimeout(() => {
      setTransitionReady(true);
    }, 1000);
  });

  return (
    <div className="w-full flex absolute h-full z-50">
      {transitionReady && (
        <Reward
          shardTargetIndex={shardTargetIndex}
          cardId={cardId}
          level={level}
          removeCurrentReward={removeCurrentReward}
        />
      )}
      <div
        className="w-1/2 h-full bg-slate-800 origin-left z-10 relative"
        ref={door1}
      ></div>
      <div
        className="w-1/2 h-full bg-slate-800 origin-right z-10 relative"
        ref={door2}
      ></div>
    </div>
  );
}

export function RewardBlockWithContext() {
  const { rewards, collectReward } = useRewardStore((state) => ({
    rewards: state.rewards,
    collectReward: state.collectReward,
  }));
  const [currentReward, setCurentReward] = useState<RewardType | null>(null);
  const [rewardLength, setRewardLength] = useState(rewards.length);

  if (rewardLength !== rewards.length) {
    setRewardLength(rewards.length);
    if (!currentReward) {
      setCurentReward(collectReward());
    }
  }

  if (!currentReward) {
    return null;
  }

  return (
    <RewardSection
      shardTargetIndex={currentReward.shardTargetIndex}
      cardId={currentReward.cardId}
      level={currentReward.level}
      removeCurrentReward={() => setCurentReward(null)}
    />
  );
}

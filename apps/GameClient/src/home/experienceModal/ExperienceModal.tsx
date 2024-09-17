import { Badge, Button, cn } from "@repo/ui";
import Ribbon from "@/home/ui/Ribbon";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getImageUrl, ICONS, textureByRarity } from "@repo/lib";
import RewardBox from "@/game/endGameScreen/RewardBox";
import ShinyRotator from "@/game/endGameScreen/ShinyRotator";
import gsap from "gsap";
import { ArrowBigRight } from "lucide-react";
import { NextLevelRewardType } from "../store/rewardStore";

interface ExperienceModalProps {
  reward: NextLevelRewardType;
  removeCurrentReward: () => void;
}

export default function ExperienceModal({ reward, removeCurrentReward }: ExperienceModalProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const shinyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rewardsRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !boxRef.current ||
        !buttonRef.current ||
        !rewardsRef.current ||
        !shinyRef.current ||
        !levelRef.current
      ) {
        return;
      }
      const tl = gsap.timeline();
      tl.resume();
      tl.set(boxRef.current, { x: -500, opacity: 0 });
      tl.set(shinyRef.current, { scale: 0, opacity: 1 });
      tl.set(buttonRef.current, { opacity: 0 });
      tl.fromTo(
        boxRef.current,
        { x: -500, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        "appear"
      );
      const level = levelRef.current.children;
      for (let i = 0; i < level.length; i++) {
        tl.fromTo(
          level[i],
          { scale: 1.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            delay: i * 0.05,
          },
          "xp"
        );
      }
      const rewards = rewardsRef.current.children;
      for (let i = 0; i < rewards.length; i++) {
        tl.fromTo(
          rewards[i],
          { scale: 1.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            delay: i * 0.1,
          },
          "reveal"
        );
      }
      tl.fromTo(
        shinyRef.current,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 1, duration: 0.4 },
        "xp"
      );
      gsap.to(shinyRef.current, {
        rotate: 360,
        duration: 60,
        repeat: -1,
        ease: "linear",
      });
      tl.fromTo(
        buttonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "reveal"
      );
    },
    {
      dependencies: [
        boxRef.current,
        shinyRef.current,
        buttonRef.current,
        rewardsRef.current,
        levelRef.current,
      ],
    }
  );

  return (
    <div className="w-screen h-full flex justify-center fixed top-0 left-0 z-30">
      <div className="w-[700px] h-full overflow-hidden flex flex-col items-center relative">
        <div className="bg-slate-800 w-full h-full absolute brightness-75 opacity-50"></div>
        <div
          className="grow flex flex-col items-center pt-48 relative"
          ref={boxRef}
        >
          <ShinyRotator forwardRef={shinyRef} />
          <Ribbon className="mb-0 relative top-[1px] z-10">Next level !</Ribbon>
          <div
            className={cn(
              "flex flex-col gap-8 items-center mb-6 py-8 w-[450px] rounded-b-sm relative overflow-hidden",
              "bg-slate-100"
            )}
          >
            <div
              className="absolute w-full h-full top-0 left-0 blur-sm"
              style={{
                backgroundImage: `url(${textureByRarity("rare")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="flex gap-6 items-center relative" ref={rewardsRef}>
              <RewardBox amount={reward.gold}>
                <img src={getImageUrl(ICONS, "/money.png")} className="h-[64px]" />
              </RewardBox>
              <RewardBox amount={"+max"}>
                <img src={getImageUrl(ICONS, "/key.png")} className="h-[64px]" />
              </RewardBox>
            </div>
            <div className="flex gap-1 items-center relative" ref={levelRef}>
              <Badge value={String(reward.previousLevel)} rarity="common" />
              <ArrowBigRight size={24} fill="black" />
              <ArrowBigRight size={24} fill="black" />
              <ArrowBigRight size={24} fill="black" />
              <Badge value={String(reward.nextLevel)} rarity="rare" />
            </div>
          </div>
          <Button action={removeCurrentReward} forwardRef={buttonRef}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

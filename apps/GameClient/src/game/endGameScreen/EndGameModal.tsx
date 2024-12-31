import {
  Badge,
  Button,
  cn,
  EmptyBar,
  KeyAmount,
  textureByRarity,
} from "@repo/ui";
import useGameMetadataStore from "../stores/gameMetadataStore";
import Ribbon from "@/home/ui/Ribbon";
import RewardBox from "./RewardBox";
import { useRef } from "react";
import endGameScreenAnimation from "./animation";
import { useGSAP } from "@gsap/react";
import { getImageUrl, ICONS } from "@repo/lib";
import ShinyRotator from "./ShinyRotator";
import { experienceService, keysService } from "@/services/inject";
import { CurrentWinner } from "game_engine";

interface EndGameScreenProps {
  currentWinner: CurrentWinner;
}

export default function EndGameModal({ currentWinner }: EndGameScreenProps) {
  const { reset: resetMetadata, rewards } = useGameMetadataStore((state) => ({
    reset: state.reset,
    rewards: state.getReward(currentWinner),
  }));

  const isWinner = currentWinner === "player";

  const {
    experienceProgress,
    experienceProgressTarget,
    previousLevel,
    nextLevel: targetLevel,
  } = experienceService.useWatchLastExperienceGain();

  const boxRef = useRef<HTMLDivElement>(null);
  const shinyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rewardsRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const nextLevelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !boxRef.current ||
        !buttonRef.current ||
        !rewardsRef.current ||
        !xpBarRef.current ||
        !nextLevelRef.current
      ) {
        return;
      }
      endGameScreenAnimation({
        boxRef: boxRef.current,
        currentXpProgress: experienceProgress,
        targetXpProgress: experienceProgressTarget,
        currentLevel: previousLevel,
        targetLevel,
        rewardsRef: rewardsRef.current,
        xpBarRef: xpBarRef.current,
        shinyRef: shinyRef.current,
        buttonRef: buttonRef.current,
        nextLevelRef: nextLevelRef.current,
        isXp: isWinner,
      });
    },
    {
      dependencies: [
        boxRef.current,
        shinyRef.current,
        buttonRef.current,
        xpBarRef.current,
        rewardsRef.current,
        nextLevelRef.current,
      ],
    }
  );

  function onContinue() {
    resetMetadata();
  }

  const modalTitles = {
    player: "Victory",
    opponent: "Defeat",
    draw: "Draw",
  };

  return (
    <div className="w-screen h-full flex justify-center fixed top-0 z-30">
      <div className="w-full h-full overflow-hidden flex flex-col items-center relative">
        <div className="bg-slate-800 w-full h-full absolute brightness-75 opacity-50"></div>
        <div
          className="grow flex flex-col items-center pt-48 relative opacity-0"
          ref={boxRef}
        >
          {isWinner && <ShinyRotator forwardRef={shinyRef} />}
          <Ribbon className="mb-0 relative top-[1px] z-10">
            {modalTitles[currentWinner!]}
          </Ribbon>
          <div
            className={cn(
              "flex flex-col gap-8 items-center mb-6 py-8 w-[450px] rounded-b-sm relative overflow-hidden",
              isWinner ? "bg-slate-100" : "bg-slate-800"
            )}
          >
            <div
              className="absolute w-full h-full top-0 left-0 blur-sm"
              style={{
                backgroundImage: `url(${textureByRarity(isWinner ? "rare" : "common")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="flex gap-6 items-center relative" ref={rewardsRef}>
              <RewardBox amount={rewards.money}>
                {rewards.money > 0 ? (
                  <img
                    src={getImageUrl(ICONS, "money.png")}
                    className="h-[64px]"
                  />
                ) : (
                  <p className="z-10 text-red-600 text-center">
                    Daily gold limit reached
                  </p>
                )}
              </RewardBox>
              <RewardBox amount={rewards.trophies}>
                <img
                  src={getImageUrl(ICONS, "trophy.png")}
                  className="h-[64px]"
                />
              </RewardBox>
            </div>
            <div className="flex gap-2 w-[350px] items-center relative">
              <Badge value={String(previousLevel)} textId="endGameXpBadge" />
              <div className="grow h-6 bg-slate-50 rounded-sm overflow-hidden relative">
                <div
                  className="absolute right-2 z-10 text-white font opacity-0"
                  ref={nextLevelRef}
                >
                  Next level !
                </div>
                <EmptyBar>
                  <div
                    ref={xpBarRef}
                    className="w-full h-full left-0 bg-gradient-to-b from-[#347FDA] via-[#60A5FA] via-[37%] to-[#347FDA] origin-left scale-x-0"
                    style={{
                      transform: `scaleX(${experienceProgress * 100}%)`,
                    }}
                  />
                </EmptyBar>
              </div>
            </div>
          </div>
          <Button action={onContinue} forwardRef={buttonRef}>
            {isWinner && keysService.hasKeyRewardWaiting() ? (
              <>
                Open a pack (<KeyAmount amount={-1} className="pl-1" />)
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

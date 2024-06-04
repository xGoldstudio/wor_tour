import { Badge, Button, textureByRarity } from "@repo/ui";
import useGameMetadataStore from "../stores/gameMetadataStore";
import useGameStore from "../stores/gameStateStore";
import Ribbon from "@/home/ui/Ribbon";
import { EmptyBar } from "../gui/ManaBar";
import BoosterIllustration from "@/home/pages/shop/BoosterIllustration";
import * as _ from "lodash";
import RewardBox from "./RewardBox";
import { useEffect, useRef, useState } from "react";
import endGameScreenAnimation from "./animation";

export default function EndGameScreen() {
  const { reset: resetMetadata } = useGameMetadataStore((state) => ({
    reset: state.reset,
  }));
  const { currentWinner } = useGameStore((state) => ({
    currentWinner: state.currentWinner,
  }));

  const isWinner = currentWinner === "player";
  const currentXpProgress = 0.5;
  const targetXpProgress = 0.8;
  const [currentLevel, setCurrentLevel] = useState(1);
  const targetLevel = 2;

  const boxRef = useRef<HTMLDivElement>(null);
  const shinyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rewardsRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const nextLevelRef = useRef<HTMLDivElement>(null);

  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  useEffect(() => {
    if (
      isAnimationRunning ||
      !boxRef.current ||
      !buttonRef.current ||
      !rewardsRef.current ||
      !xpBarRef.current ||
      !nextLevelRef.current
    ) {
      return;
    }
    setIsAnimationRunning(true);
    endGameScreenAnimation({
      boxRef: boxRef.current,
      currentXpProgress,
      targetXpProgress,
      currentLevel,
      targetLevel,
      rewardsRef: rewardsRef.current,
      xpBarRef: xpBarRef.current,
      shinyRef: shinyRef.current,
      buttonRef: buttonRef.current,
      nextLevelRef: nextLevelRef.current,
      setCurrentLevel,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    boxRef.current,
    shinyRef.current,
    buttonRef.current,
    xpBarRef.current,
    rewardsRef.current,
    nextLevelRef.current,
  ]);

  if (!currentWinner) {
    return null;
  }

  return (
    <div className="w-screen h-full flex justify-center fixed top-0 z-10">
      <div className="w-[700px] h-full overflow-hidden flex flex-col items-center relative">
        <div className="bg-slate-800 w-full h-full absolute brightness-75 opacity-50"></div>
        <div
          className="grow flex flex-col items-center pt-48 relative opacity-0"
          ref={boxRef}
        >
          {isWinner && <ShinyRotator forwardRef={shinyRef} />}
          <Ribbon className="mb-0 relative top-[1px] z-10">
            {isWinner ? "Victory" : "Defeat"}
          </Ribbon>
          <div className="flex flex-col gap-8 items-center mb-6 py-8 w-[450px] rounded-b-sm relative bg-slate-100 overflow-hidden">
            <div
              className="absolute w-full h-full top-0 left-0 blur-sm"
              style={{
                backgroundImage: `url(/${textureByRarity(isWinner ? "rare" : "common")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="flex gap-6 items-center relative" ref={rewardsRef}>
              <RewardBox amount={1}>
                <BoosterIllustration
                  size={0.4}
                  title="Victory reward"
                  illustration=""
                />
              </RewardBox>
              <RewardBox amount={15000}>
                <img src="/money.png" className="h-[100px]" />
              </RewardBox>
            </div>
            <div className="flex gap-2 w-[350px] items-center relative">
              <Badge value={String(currentLevel)} />
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
                      transform: `scaleX(${currentXpProgress * 100}%)`,
                    }}
                  />
                </EmptyBar>
              </div>
            </div>
          </div>
          <Button
            action={resetMetadata}
            className="w-[450px]"
            forwardRef={buttonRef}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShinyRotator({
  forwardRef,
}: {
  forwardRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className="w-screen h-screen absolute top-1/2 -translate-y-[600px] scale-0"
      ref={forwardRef}
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
            fill={`url(${"#gradient"})`}
            transform={`rotate(${index * (360 / 8)} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}

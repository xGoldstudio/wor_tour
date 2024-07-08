import { useRef, useState } from "react";
import gsap from "gsap";
import useRewardStore, { RewardType } from "@/home/store/rewardStore";
import CardReward from "./CardReward";
import GoldReward from "./GoldReward";
import { Header } from "@/home/Home";
import { useGSAP } from "@gsap/react";
import ChestReward from "./ChestReward";

function RewardSection({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const [transitionReady, setTransitionReady] = useState<
    false | "layout" | "end"
  >(false);

  useGSAP(
    () => {
      if (!scope.current) return;
      const doorLeft = scope.current.querySelector(".doorLeft");
      const doorRight = scope.current.querySelector(".doorRight");
      if (!doorLeft || !doorRight) return;
      const tl = gsap.timeline({
        onComplete: () => setTransitionReady("end"),
      });
      tl.fromTo(doorLeft, { scaleX: 0 }, { scaleX: 1, duration: 1 }, "open");
      tl.fromTo(
        doorRight,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          onComplete: () => setTransitionReady("layout"),
        },
        "open"
      );
      tl.addLabel("close", "+=0.5");
      tl.to(doorLeft, { scaleX: 0, duration: 1 }, "close");
      tl.to(doorRight, { scaleX: 0, duration: 1 }, "close");
    },
    { scope }
  );

  return (
    <div className="w-full flex absolute h-full z-50" ref={scope}>
      {transitionReady && (
        <div className="w-full h-full absolute z-10 flex flex-col">
          <div
            className="w-full h-full absolute brightness-75"
            style={{
              backgroundImage: "url('/homeBg.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="w-full h-full absolute bg-[linear-gradient(0deg,_rgba(226,232,240,0.2)_0%,_rgba(226,232,240,0)_100%),_linear-gradient(0deg,_rgba(226,232,240,0)_50%,_rgba(226,232,240,1)_70%)]" />
          </div>
          <Header />
          {transitionReady === "end" && children}
        </div>
      )}
      <div className="doorLeft w-1/2 h-full bg-slate-800 origin-left z-10 relative scale-x-0"></div>
      <div className="doorRight w-1/2 h-full bg-slate-800 origin-right z-10 relative scale-x-0"></div>
    </div>
  );
}

export function RewardBlockWithContext() {
  const { rewards, collectReward } = useRewardStore((state) => ({
    rewards: state.rewards,
    collectReward: state.collectReward,
  }));
  const [currentReward, setCurentReward] = useState<RewardType | null>(null);

  if (rewards.length && currentReward === null) {
    setCurentReward(collectReward()); // pop the first reward
  }

  if (!currentReward) {
    return null;
  }

  return (
    <RewardSection>
      <div className="grow">
        {currentReward.type === "card" && (
          <CardReward
            reward={currentReward}
            removeCurrentReward={() => setCurentReward(null)}
          />
        )}
        {currentReward.type === "gold" && (
          <GoldReward
            reward={currentReward}
            removeCurrentReward={() => setCurentReward(null)}
          />
        )}
        {currentReward.type === "chest" && (
          <ChestReward
            reward={currentReward}
            removeCurrentReward={() => setCurentReward(null)}
          />
        )}
      </div>
    </RewardSection>
  );
}

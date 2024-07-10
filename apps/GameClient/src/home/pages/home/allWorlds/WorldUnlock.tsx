import { HomeBg } from "@/home/Home";
import { Button, cn, Cover, getImageUrl, inPx } from "@repo/ui";
import { useContext, useRef } from "react";
import {
  AllWorldsAnimationContext,
  AllWorldsAnimationContextType,
} from "./trophyBar/TrophyBarContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import usePlayerStore from "@/home/store/playerStore";
import useDataStore from "@/cards/DataStore";
import StaticCard from "@/game/gui/card/StaticCard";
import { getCardFromLevel } from "@/cards";

export default function WorldUnlock({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { setState } = useContext(
    AllWorldsAnimationContext
  ) as AllWorldsAnimationContextType;
  const elementRef = document.getElementById("worldIllustration");
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setState("normal");
      },
    });
		tl.fromTo(
      ref.current.querySelector(".footer"),
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      "start"
    );
    tl.fromTo(
      ref.current.querySelector(".worldFieldIllustration"),
      {
        scale: 0,
      },
      {
        ease: "bounce.inOut",
        scale: 1,
        duration: 1,
      },
      "start"
    );
    tl.fromTo(
      ref.current.querySelector(".worldFieldIllustration"),
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      "start"
    );
    tl.fromTo(
      ref.current.querySelector(".text"),
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: -40,
        duration: 0.5,
        ease: "elastic",
      },
      "start+=0.5"
    );
		const cards = ref.current.querySelectorAll(".cards>div");
		tl.set(cards, { opacity: 0, y: -100 }, "start");
    tl.fromTo(
      cards,
      {
        opacity: 0,
        y: -100,
      },
      {
        opacity: 1,
        duration: 0.5,
        y: 0,
        stagger: 0.1,
      }
    );
    tl.fromTo(
      cards,
      {
        opacity: 1,
        x: 0,
      },
      {
        opacity: 0,
        x: -20,
        duration: 0.3,
				delay: 0.5,
      }
    );
  }, [ref]);
  const currentWorld = usePlayerStore((state) => state.currentWorld);
  const world = useDataStore((state) => state.worlds[currentWorld - 1]!);
  const cards = useDataStore((state) => state.cards)
    .filter((card) => card.world === world.id)
    .map((card) => getCardFromLevel(card, 3));

  return (
    <div className="w-full h-full absolute top-0 z-10" ref={ref}>
      <HomeBg />
      <div
        className="fixed"
        style={{
          top: inPx(elementRef?.getBoundingClientRect().top ?? 0),
          left: inPx(elementRef?.getBoundingClientRect().left ?? 0),
        }}
      >
        <p className="text absolute -top-4 -translate-y-full text-4xl text-white drop-shadow-[2px_2px_2px_black]">
          New World Unlocked !
        </p>
        <WorldImage />
        <div className="cards flex gap-2 pt-8 flex-wrap w-full justify-center max-w-[400px]">
          {cards.map((card) => (
            <StaticCard card={card} size={0.65} key={card.id} />
          ))}
        </div>
      </div>
      <div className="footer w-full h-[66px] bg-slate-600 flex justify-center items-center z-20 absolute bottom-0">
        <Cover cardRarity="rare" />
        <Button action={closeModal} rarity="epic" className="px-20 text-white">
          Ok
        </Button>
      </div>
    </div>
  );
}

function WorldImage() {
  const { currentWorld } = usePlayerStore((state) => ({
    trophies: state.trophies,
    currentWorld: state.currentWorld,
  }));
  const world = useDataStore((state) => state.worlds[currentWorld - 1]);

  return (
    <img
      className={cn(
        `worldFieldIllustration`,
        "w-[350px] aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)] cursor-pointer"
      )}
      src={getImageUrl(world.illustration)}
    />
  );
}

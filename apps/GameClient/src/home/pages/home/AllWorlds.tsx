import useDataStore, { World } from "@/cards/DataStore";
import { HomeBg } from "@/home/Home";
import Cover from "@/home/ui/Cover";
import { Badge, Button, cn, getImageUrl, useOnMount } from "@repo/ui";
import { getCardFromLevel } from "@/cards";
import StaticCard from "@/game/gui/card/StaticCard";
import _ from "lodash";
import TrophyBar from "./trophyBar/TrophyBar";
import TrophyBarProvider, {
  TrophiesField,
  TrophyBarContext,
  TrophyBarContextType,
} from "./trophyBar/TrophyBarContext";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import usePlayerStore from "@/home/store/playerStore";
import ScrollContainer from "react-indiana-drag-scroll";
import gsap from "gsap";
import WorldModal from "./modals/WorldModal";

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

const emptyGlowChestImageByLevel = {
  common: "chests/common_empty_yellow_glow.png",
  rare: "chests/rare_empty_yellow_glow.png",
  epic: "chests/mythical_empty_yellow_glow.png",
};

const emptyChestImageByLevel = {
  common: "/chests/common_empty_no_glow.png",
  rare: "/chests/rare_empty_no_glow.png",
  epic: "/chests/mythical_empty_no_glow.png",
};

export default function AllWorlds({ closeModal }: { closeModal: () => void }) {
  const home = document.getElementById("home");

  if (!home) return null;

  return createPortal(
    <TrophyBarProvider>
      <AllWorldsInner closeModal={closeModal} />
    </TrophyBarProvider>,
    home
  );
}

function findPosition(trophiesFields: TrophiesField[], trophies: number) {
  const currentRange: [TrophiesField, TrophiesField] = [
    trophiesFields[0] ?? { trophies: 0, yPosition: 0 },
    trophiesFields[1] ?? { trophies: 0, yPosition: 0 },
  ];

  for (let i = 0; i < trophiesFields.length; ++i) {
    const currentTrophiesField = trophiesFields[i];
    const nextTrophiesField = trophiesFields[i + 1];

    if (
      currentTrophiesField.trophies <= trophies &&
      nextTrophiesField.trophies >= trophies
    ) {
      currentRange[0] = currentTrophiesField;
      currentRange[1] = nextTrophiesField;
      break;
    }
  }

  const currentTrophiesRange =
    currentRange[1].trophies - currentRange[0].trophies;
  const currentPositionRange =
    currentRange[1].yPosition - currentRange[0].yPosition;
  const currentTrophiesPosition =
    (trophies - currentRange[0].trophies) / currentTrophiesRange;
  const targetYPosition =
    currentRange[0].yPosition + currentTrophiesPosition * currentPositionRange;

  return targetYPosition;
}

function AllWorldsInner({ closeModal }: { closeModal: () => void }) {
  const { worlds } = useDataStore((state) => ({
    worlds: [...state.worlds].reverse(),
  }));
  const { trophies, maxTrophies } = usePlayerStore((state) => ({
    trophies: state.trophies,
    maxTrophies: state.maxTrophies,
  }));

  const ref = useRef<null | HTMLDivElement>(null);

  const { trophiesFields } = useContext(
    TrophyBarContext
  ) as TrophyBarContextType;

  // get the range of the current trophies
  const targetYPosition = findPosition(trophiesFields, trophies);
  const maxTargetYPosition = findPosition(trophiesFields, maxTrophies);

  const [distanceFromTrophies, setDistanceFromTrophies] = useState(0);

  function setScrollDistancePosition() {
    if (ref.current) {
      const allowedDistanceTop =
        ref.current.getBoundingClientRect().height - 150;
      const allowedDistanceBottom = -50;
      const scrollPosition = ref.current.scrollTop;
      const distance = scrollPosition - targetYPosition;
      if (distance > allowedDistanceBottom) {
        setDistanceFromTrophies(1);
        return;
      } else if (distance < -allowedDistanceTop) {
        setDistanceFromTrophies(-1);
        return;
      }
      setDistanceFromTrophies(0);
    }
  }

  const [currentTrophiesField, setCurrentTrophiesField] = useState(0);
  const revealLevelQueue = useRef<(() => void)[]>([]).current;
  const [,setIsRevealRunning] = useState(false);

  function revealLevelsRunner() {
    // ensure that the runner is not running
    setIsRevealRunning((isRunning) => {
      if (isRunning) {
        return isRunning;
      }
      function nextReveal() {
        setTimeout(() => {
          if (revealLevelQueue.length) {
            revealLevelQueue.shift()?.();
            nextReveal();
          } else {
            setIsRevealRunning(false);
          }
        }, 50);
      }
      nextReveal();
      return true;
    });
  }

  function revealLevels() {
    if (!ref.current || currentTrophiesField >= trophiesFields.length) {
      return;
    }
    const scrollPosition = ref.current.scrollTop;
    const animations: (() => void)[] = [];
    setCurrentTrophiesField((initIndex) => {
      let index = initIndex;
      let trophieFieldPosition = trophiesFields[index].yPosition;
      function nextReveal() {
        if (scrollPosition < trophieFieldPosition) {
          animations.push(trophiesFields[index].animate);
          index++;
          if (index < trophiesFields.length) {
            trophieFieldPosition = trophiesFields[index].yPosition;
            nextReveal();
          }
        }
      }
      nextReveal();
      if (index !== initIndex) {
        animations.forEach((animation) => {
          revealLevelQueue.push(animation);
          revealLevelsRunner();
        });
      }
      return index;
    });
  }

  function onScroll() {
    setScrollDistancePosition();
    revealLevels();
  }

  // allow first render to set the scroll distance and reveal levels
  useEffect(() => {
    onScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trophiesFields]);

  const [hasRendered, setHasRendered] = useState(false);
  useOnMount(() => {
    setHasRendered(true);
  });

  return (
    <div
      className={cn(
        "absolute top-0 w-full h-full grid grid-cols-1 grid-rows-[1fr_66px] items-center justify-end z-20 select-none opacity-0 transition-opacity",
        hasRendered && "opacity-100"
      )}
    >
      <div className="absolute w-full h-full z-20 hidden" id="scrollBlocker" />
      <HomeBg />
      <ScrollContainer
        className={cn(
          "max-h-[100%] overflow-hidden w-full flex flex-col relative"
        )}
        innerRef={ref}
        onScroll={onScroll}
      >
        <div className="relative">
          {ref.current && (
            <TrophyBar
              scrollRef={ref.current}
              targetYPosition={targetYPosition}
              maxTargetYPosition={maxTargetYPosition}
              distanceFromTrophies={distanceFromTrophies}
              numberOfTrophies={trophies}
            />
          )}
          {worlds.map((world) => (
            <WorldPreview world={world} key={world.id} scroller={ref.current} />
          ))}
        </div>
      </ScrollContainer>
      <div className="w-full h-full relative bg-slate-600 flex justify-center items-center z-20">
        <Cover cardRarity="rare" />
        <Button action={closeModal} rarity="epic" className="px-20 text-white">
          Ok
        </Button>
      </div>
    </div>
  );
}

function WorldPreview({
  world,
}: {
  world: World;
  scroller: HTMLDivElement | null;
}) {
  const cards = useDataStore((state) => state.cards)
    .filter((card) => card.world === world.id)
    .map((card) => getCardFromLevel(card, 3));
  const { playerTrophies } = usePlayerStore((state) => ({
    playerTrophies: state.trophies,
  }));

  const worldTrophies = (world.id - 1) * 1000;

  const { addTrophiesField } = useContext(
    TrophyBarContext
  ) as TrophyBarContextType;
  const worldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (worldRef.current) {
      addTrophiesField(
        worldTrophies,
        worldRef.current.getBoundingClientRect().top +
          worldRef.current.clientHeight / 2,
        () => {}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldRef, world.id, addTrophiesField]);

  const isUnlocked = worldTrophies <= playerTrophies;
  const [isWorldModalOpen, setIsWorldModalOpen] = useState(false);

  return (
    <div className="flex flex-col relative items-center w-full justify-center">
      {isWorldModalOpen && (
        <WorldModal closeModal={() => setIsWorldModalOpen(false)} />
      )}
      <div className="flex gap-8 flex-col py-8 w-[350px] ">
        {_.range(1, 10).map((i) => (
          <LevelPreview i={10 - i} worldTrophies={worldTrophies} key={i} />
        ))}
      </div>
      <div className="flex flex-col relative items-center gap-2 w-full py-4 justify-center">
        <div className="absolute w-full h-full bg-slate-400 opacity-20" />
        <div className="flex flex-col relative items-center gap-2 w-[400px]">
          <img
            className={cn(
              "w-[250px] aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)] cursor-pointer",
              !isUnlocked && "grayscale-[80%]"
            )}
            onClick={() => setIsWorldModalOpen(true)}
            src={getImageUrl(world.illustration)}
          />
          <p className="text-3xl text-white font-stylised pb-4 drop-shadow-[2px_2px_1px_black]">
            {world.name}
          </p>
          <div
            className="flex items-center justify-between w-full bg-slate-50 px-4 py-2 rounded-sm relative cursor-pointer"
            ref={worldRef}
            onClick={() => setIsWorldModalOpen(true)}
          >
            <Cover cardRarity="rare" />
            <div className="flex items-center gap-2 relative">
              <Badge value={`${world.id}`} rarity="epic" />
              <p className="font-semibold">World {world.id}</p>
            </div>
            <div className="flex items-center relative">
              <img
                src="/trophy.png"
                className="w-[32px] drop-shadow-[2px_1px_1px_black]"
              />
              <p className="relative font-semibold">{worldTrophies}</p>
            </div>
            <Button
              action={() => setIsWorldModalOpen(true)}
              rarity="rare"
              small
            >
              i
            </Button>
          </div>
          <p className="text-white">Cards unlocked</p>
          <div className="flex gap-2 flex-wrap w-full justify-center">
            {cards.map((card) => (
              <StaticCard
                card={card}
                size={0.65}
                key={card.id}
                isDisabled={!isUnlocked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelPreview({
  i,
  worldTrophies,
}: {
  i: number;
  worldTrophies: number;
}) {
  const { addTrophiesField } = useContext(
    TrophyBarContext
  ) as TrophyBarContextType;
  const levelTrophies = worldTrophies + i * 100;
  const { maxTrophies, isToCollect, collectReward } = usePlayerStore(
    (state) => ({
      maxTrophies: state.maxTrophies,
      isToCollect: state.getIsToCollectTrophiesReward(levelTrophies),
      collectReward: () => state.collectedTrophiesReward(levelTrophies),
    })
  );
  const levelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (levelRef.current) {
      addTrophiesField(
        levelTrophies,
        levelRef.current.getBoundingClientRect().top +
          levelRef.current.clientHeight / 2,
        () =>
          gsap.to(levelRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
      );
    }
  }, [levelRef, i, addTrophiesField]);

  const isUnlocked = levelTrophies <= maxTrophies;
  const isEmpty = isUnlocked && !isToCollect;

  return (
    <div
      className={cn(
        "w-full flex justify-center items-center relative h-[80px] opacity-0 scale-[20%]",
        !isUnlocked && "grayscale-[80%]",
        isToCollect &&
          "animate-[collectable_2s_ease-in-out_infinite] cursor-pointer"
      )}
      ref={levelRef}
      onClick={isToCollect ? collectReward : () => {}}
    >
      <div className="absolute w-full h-full bg-slate-400 opacity-60 rounded-md" />
      <div
        className="absolute w-full h-full rounded-md"
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

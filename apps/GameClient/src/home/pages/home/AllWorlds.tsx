import useDataStore, { World } from "@/cards/DataStore";
import { HomeBg } from "@/home/Home";
import Cover from "@/home/ui/Cover";
import { Badge, Button, cn, getImageUrl } from "@repo/ui";
import { getCardFromLevel } from "@/cards";
import StaticCard from "@/game/gui/card/StaticCard";
import ScrollContainer from "react-indiana-drag-scroll";
import _ from "lodash";
import TrophyBar from "./trophyBar/TrophyBar";
import TrophyBarProvider, {
  TrophiesField,
  TrophyBarContext,
  TrophyBarContextType,
} from "./trophyBar/TrophyBarContext";
import { useContext, useEffect, useRef, useState } from "react";

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

export default function AllWorlds() {
  return (
    <TrophyBarProvider>
      <AllWorldsInner />
    </TrophyBarProvider>
  );
}

function AllWorldsInner() {
  const { worlds } = useDataStore((state) => ({
    worlds: [...state.worlds].reverse(),
  }));

  const ref = useRef<null | HTMLDivElement>(null);

  const { trophiesFields } = useContext(
    TrophyBarContext
  ) as TrophyBarContextType;

  const sortedTrophiesFields = [...trophiesFields].sort(
    (a, b) => a.trophies - b.trophies
  );

  const currentTrophies = 2075;

  // get the range of the current trophies
  const currentRange: [TrophiesField, TrophiesField] = [
    sortedTrophiesFields[0] ?? { trophies: 0, yPosition: 0 },
    sortedTrophiesFields[1] ?? { trophies: 0, yPosition: 0 },
  ];

  for (let i = 0; i < sortedTrophiesFields.length; ++i) {
    const currentTrophiesField = sortedTrophiesFields[i];
    const nextTrophiesField = sortedTrophiesFields[i + 1];

    if (
      currentTrophiesField.trophies <= currentTrophies &&
      nextTrophiesField.trophies >= currentTrophies
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
    (currentTrophies - currentRange[0].trophies) / currentTrophiesRange;
  const targetYPosition =
    currentRange[0].yPosition + currentTrophiesPosition * currentPositionRange;

  const [distanceFromTrophies, setDistanceFromTrophies] = useState(0);

  function setScrollDistancePosition() {
    if (ref.current) {
      const allowedDistanceTop = ref.current.getBoundingClientRect().height - 150;
      const allowedDistanceBottom = -50;
      const scrollPosition = ref.current.scrollTop;
      const distance = scrollPosition - targetYPosition;
      if (distance > allowedDistanceBottom) {
        setDistanceFromTrophies(1);
        return;
      } else if (distance < -allowedDistanceTop) {
        setDistanceFromTrophies(scrollPosition - targetYPosition);
        return;
      }
      setDistanceFromTrophies(0);
    }
  }

  return (
    <div className="absolute w-full h-full grid grid-cols-1 grid-rows-[1fr_66px] items-center justify-end z-20 select-none">
      <HomeBg />
      <ScrollContainer
        className="max-h-[100%] overflow-hidden w-full flex flex-col relative"
        innerRef={ref}
        onScroll={setScrollDistancePosition}
      >
        <div className="relative">
          {ref.current && (
            <TrophyBar
              scrollRef={ref.current}
              targetYPosition={targetYPosition}
              distanceFromTrophies={distanceFromTrophies}
              numberOfTrophies={currentTrophies}
            />
          )}
          {worlds.map((world) => (
            <WorldPreview world={world} key={world.id} />
          ))}
        </div>
      </ScrollContainer>
      <div className="w-full h-full relative bg-slate-600 flex justify-center items-center">
        <Cover cardRarity="rare" />
        <Button action={() => {}} rarity="epic" className="px-20 text-white">
          Ok
        </Button>
      </div>
    </div>
  );
}

function WorldPreview({ world }: { world: World }) {
  const cards = useDataStore((state) => state.cards)
    .filter((card) => card.world === world.id)
    .map((card) => getCardFromLevel(card, 3));

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
          worldRef.current.clientHeight / 2
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldRef, world.id, addTrophiesField]);

  return (
    <div className="flex flex-col relative items-center w-full justify-center">
      <div className="flex gap-8 flex-col py-8 w-[350px] ">
        {_.range(1, 10).map((i) => (
          <LevelPreview i={10 - i} worldTrophies={worldTrophies} key={i} />
        ))}
      </div>
      <div className="flex flex-col relative items-center gap-2 w-full py-4 justify-center">
        <div className="absolute w-full h-full bg-slate-400 opacity-20" />
        <div className="flex flex-col relative items-center gap-2 w-[400px]">
          <img
            className="w-[250px] aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)]"
            src={getImageUrl(world.illustration)}
          />
          <p className="text-3xl text-white font-stylised pb-4 drop-shadow-[2px_2px_1px_black]">
            {world.name}
          </p>
          <div
            className="flex items-center justify-between w-full bg-slate-50 px-4 py-2 rounded-sm relative"
            ref={worldRef}
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
            <Button action={() => {}} rarity="rare" small>
              i
            </Button>
          </div>
          <p className="text-white">Cards unlocked</p>
          <div className="flex gap-2 flex-wrap w-full justify-center">
            {cards.map((card) => (
              <StaticCard card={card} size={0.65} key={card.id} />
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
  const levelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (levelRef.current) {
      addTrophiesField(
        worldTrophies + i * 100,
        levelRef.current.getBoundingClientRect().top +
          levelRef.current.clientHeight / 2
      );
    }
  }, [levelRef, i, addTrophiesField]);

  return (
    <div
      className="w-full flex justify-center items-center relative h-[80px]"
      ref={levelRef}
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
          "absolute  bottom-[15px] rounded-sm overflow-hidden",
          i % 2 ? "right-[50px]" : "left-[50px]"
        )}
      >
        <Cover cardRarity="rare" className="opacity-80 bg-slate-50" />
        <img
          src={chestImageByLevel["rare"]}
          alt="chest"
          className="left-0 top-0 w-[80px] aspect-square relative"
        />
      </div>
    </div>
  );
}

import { useStartGame } from "@/game/stores/gameMetadataStore";
import * as _ from "lodash";
import useScrollCardList from "../deck/useScrollCardList";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import useDataStore from "@/cards/DataStore";
import { Level } from "@repo/types";
import {
  Badge,
  Box,
  Button,
  cn,
  inPx,
  preventDefault,
  useOnMount,
  useOnUnMount,
  getImageUrlCssValue,
} from "@repo/ui";
import { numberOfLevels } from "../../../../../Editor/src/editor/features/progression/consts";
import usePlayerStore from "@/home/store/playerStore";

export default function HomeTab() {
  const startGame = useStartGame();
  const [currentWorld, setCurrentWorld] = useState(0);
  const { world, levels } = useDataStore((state) => ({
    world: state.worlds[currentWorld],
    levels: state.levels,
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-4xl font-stylised">{world.name}</div>
      <div
        className="w-1/2 aspect-square relative"
        style={{
          backgroundImage: getImageUrlCssValue(world.illustration),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Badge
          className="absolute z-10 right-0 top-0"
          value={`${world.id}`}
          rarity="epic"
        />
      </div>
      <Levels
        levels={levels.filter((level) => world.id === level.world)}
        nextWorldLevel={
          levels.find(
            (level) => world.id + 1 === level.world && level.level === 1
          ) || null
        }
        previousWorldLevel={
          levels.find(
            (level) =>
              world.id - 1 === level.world && level.level === numberOfLevels
          ) || null
        }
        onPageChange={(newPage: number) => setCurrentWorld(newPage)}
      />
      <Button action={() => startGame()}>New game</Button>
    </div>
  );
}

function Levels({
  levels,
  onPageChange,
  previousWorldLevel,
  nextWorldLevel,
}: {
  levels: Level[];
  onPageChange: (newPage: number) => void;
  previousWorldLevel: Level | null;
  nextWorldLevel: Level | null;
}) {
  const lastCompletedLevel = usePlayerStore(
    (state) => state.lastCompletedLevel + 1
  );
  const lastCompletedWorld = Math.floor(lastCompletedLevel / numberOfLevels) + 1;
  const lastCompletedLevelInWorld = lastCompletedLevel % numberOfLevels + 1;
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    0,
    numberOfLevels,
    {
      onLastPage: lastCompletedLevelInWorld,
      pages: lastCompletedWorld,
      onPageChange,
    }
  );

  const currentLevel = currentPosition;

  return (
    <div
      className=" w-[350px] h-[118px] flex flex-col justify-end select-none relative"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
      }}
      onMouseDown={preventDefault(() => setIsPressed(true))}
      onMouseUp={preventDefault(() => setIsPressed(false))}
      onMouseMove={changePosition}
    >
      <div
        className="h-auto relative flex"
        style={{
          transform: `translateX(${currentLevel * -100 + 25}px)`,
          transition: "ease-in-out 0.5s",
          transitionProperty: "transform, opacity",
          width: inPx((levels.length + 3) * 100),
        }}
      >
        <svg
          className="w-full h-[10px] absolute top-[38px]"
          viewBox={`0 0 ${100 * (levels.length + 3)} 4`}
        >
          {_.range(6.66 * (levels.length + 3)).map((index) => (
            <circle
              cx={index * 15 + 5}
              cy={2}
              r={4}
              key={index}
              fill="white"
              style={{ transition: "ease-in-out 0.5s" }}
            />
          ))}
        </svg>
        {previousWorldLevel ? (
          <LevelComponent level={previousWorldLevel} />
        ) : (
          <div className="w-[100px]" />
        )}
        {levels.map((level) => (
          <LevelComponent
            level={level}
            selected={level.level === currentLevel + 1}
          />
        ))}
        {nextWorldLevel ? (
          <LevelComponent level={nextWorldLevel} />
        ) : (
          <div className="w-[100px]" />
        )}
      </div>
    </div>
  );
}

interface LevelProps {
  level: Level;
  selected?: boolean;
}

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

function LevelComponent({ level, selected }: LevelProps) {
  const [showPopin, setShowPopin] = useState(false);
  const ref = useRef(null);
  const isCompleted = usePlayerStore(
    (state) => state.lastCompletedLevel >= level.id
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 drop-shadow-[1px_1px_1px_black] px-[12px] w-[100px]"
      )}
      ref={ref}
    >
      <div
        className="w-[64px] h-[64px] relative"
        // onMouseEnter={() => setShowPopin(true)}
        // onMouseLeave={() => setShowPopin(false)}
      >
        <img
          src={
            isCompleted
              ? emptyChestImageByLevel[level.chest]
              : chestImageByLevel[level.chest]
          }
          alt="chest"
          className="absolute left-0 top-0 w-[64px] aspect-square"
          style={{
            transform: ` translateY(${selected ? -15 : 0}%) scale(160%)`,
            transition: "ease-in-out 0.5s",
            transitionProperty: "transform, opacity",
          }}
        />
        <img
          src={
            isCompleted
              ? emptyGlowChestImageByLevel[level.chest]
              : glowChestImageByLevel[level.chest]
          }
          alt="chest"
          className="w-[64px] aspect-square"
          style={{
            transform: `translateY(${selected ? -15 : 0}%) scale(160%)`,
            opacity: selected ? 1 : 0,
            transition: "ease-in-out 0.5s",
            transitionProperty: "transform, opacity",
          }}
        />
      </div>
      <p className="text-xl font-bold text-white">
        {level.world} - {level.level}
      </p>
      {showPopin && (
        <Popin targetRef={ref} closePopin={() => setShowPopin(false)}>
          <div className="absolute w-full h-full top-0 left-0 z-10 text-xs flex justify-around items-center">
            <div className="w-[50px] h-[50px] flex justify-end items-center flex-col relative bg-yellow-300 pb-[2px] rounded-sm border-2 border-yellow-500">
              <img
                src="/money.png"
                className="w-[32px] drop-shadow-[2px_1px_1px_black] absolute bottom-[10px]"
              />
              <p className="">+{level.reward.gold}</p>
            </div>
            <div className="w-[50px] h-[50px] flex justify-end items-center flex-col relative bg-yellow-300 pb-[2px] rounded-sm border-2 border-yellow-500">
              <div className="w-[32px] drop-shadow-[2px_1px_1px_black] absolute bottom-[15px] font-stylised text-2xl">
                XP
              </div>
              <p className="">+{level.reward.xp}</p>
            </div>
          </div>
        </Popin>
      )}
    </div>
  );
}

interface PopinProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLDivElement>;
  closePopin: () => void;
}

function Popin({ children, targetRef, closePopin }: PopinProps) {
  const home = document.getElementById("root");

  const handleClick = () => {
    closePopin();
  };

  useOnMount(() => {
    document.addEventListener("mousedown", handleClick);
  });

  useOnUnMount(() => {
    document.removeEventListener("mousedown", handleClick);
  });

  if (!home || !targetRef.current) return null;

  const { top, left } = targetRef.current.getBoundingClientRect();

  return createPortal(
    <div
      className="z-10 fixed -translate-y-[calc(100%_+_10px)] -translate-x-1/2 pointer-events-none"
      style={{
        top: inPx(top),
        left: inPx(left + targetRef.current.offsetWidth / 2),
      }}
    >
      <Box width={130} height={80} size={0.5} rarity="common" cover="rare">
        {children}
      </Box>
    </div>,
    home
  );
}

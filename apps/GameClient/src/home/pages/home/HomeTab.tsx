import { useStartGame } from "@/game/stores/gameMetadataStore";
import * as _ from "lodash";
import useScrollCardList from "../deck/useScrollCardList";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import useDataStore from "@/cards/DataStore";
import { Level } from "@repo/types";
import { Badge, Box, Button, cn, inPx, preventDefault, useOnMount, useOnUnMount, textureByRarity, getImageUrlCssValue } from "@repo/ui";

export default function HomeTab() {
  const startGame = useStartGame();
  const currentWorld = useDataStore((state) => state.worlds[0]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-4xl font-stylised">{currentWorld.name}</div>
      <div
        className="w-1/2 aspect-square relative"
        style={{
          backgroundImage: getImageUrlCssValue(currentWorld.illustration),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Badge
          className="absolute z-10 right-0 top-0"
          value={`${currentWorld.id}`}
          rarity="epic"
        />
      </div>
      <Levels levels={currentWorld.levels} currentWorld={currentWorld.id} />
      <Button action={() => startGame()}>New game</Button>
    </div>
  );
}

function Levels({ levels }: { levels: Level[]; currentWorld: number }) {
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    0,
    levels.length,
  );

  const currentLevel = currentPosition + 1;

  return (
    <div
      className=" w-[350px] h-[105px] flex flex-col justify-end select-none relative"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
      }}
      onMouseDown={preventDefault(() => setIsPressed(true))}
      onMouseUp={preventDefault(() => setIsPressed(false))}
      onMouseMove={changePosition}
    >
      <div
        className="w-[1000px] h-auto relative flex"
        style={{
          transform: `translateX(${(currentLevel - 1) * -100 + 100}px)`,
          transition: "ease-in-out 0.5s",
          transitionProperty: "transform, opacity",
        }}
      >
        <svg
          className="w-full h-[10px] absolute top-[38px]"
          viewBox="0 0 1000 4"
        >
          {_.range(7 * levels.length + 5).map((index) => (
            <circle
              cx={index * 12.5 + 6}
              cy={2}
              r={4}
              key={index}
              fill="white"
              style={{ transition: "ease-in-out 0.5s" }}
            />
          ))}
        </svg>
        {levels.map((level) => (
          <LevelComponent
            key={level.id}
            level={level.id}
            world={level.world}
            distance={level.id - currentLevel}
            selected={level.id === currentLevel}
            levelData={level}
          />
        ))}
      </div>
    </div>
  );
}

interface LevelProps {
  level: number;
  world: number;
  distance: number;
  selected?: boolean;
  levelData: Level;
}

function LevelComponent({
  level,
  world,
  selected,
  distance,
  levelData,
}: LevelProps) {
  const [showPopin, setShowPopin] = useState(false);
  const outside = Math.abs(distance) > 1;
  const ref = useRef(null);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 drop-shadow-[1px_1px_1px_black] px-[12px] w-[100px]",
      )}
      style={{
        transform: `translateX(${25}px)`,
        transition: "ease-in-out 0.5s",
        transitionProperty: "transform, opacity",
        opacity: outside ? 0 : 1,
      }}
      onClick={() => setShowPopin(true)}
      ref={ref}
    >
      <img
        src="/chest.png"
        alt="chest"
        className="w-[64px] aspect-square"
        style={{
          transform: ` translateY(${selected ? -15 : 0}%)`,
          transition: "ease-in-out 0.5s",
          transitionProperty: "transform, opacity",
        }}
      />
      <p className="text-xl font-bold text-white">
        {world} - {level}
      </p>
      {showPopin && (
        <Popin targetRef={ref} closePopin={() => setShowPopin(false)}>
          <div className="absolute w-full h-full top-0 left-0 z-10 text-xs flex justify-around items-center">
            <div className="w-[50px] h-[50px] flex justify-end items-center flex-col relative bg-yellow-300 pb-[2px] rounded-sm border-2 border-yellow-500">
              <img
                src="/money.png"
                className="w-[32px] drop-shadow-[2px_1px_1px_black] absolute bottom-[10px]"
              />
              <p className="">+{levelData.reward.gold}</p>
            </div>
            <div className="w-[50px] h-[50px] flex justify-end items-center flex-col relative bg-yellow-300 pb-[2px] rounded-sm border-2 border-yellow-500">
              <div className="w-[32px] drop-shadow-[2px_1px_1px_black] absolute bottom-[15px] font-stylised text-2xl">
                XP
              </div>
              <p className="">+{levelData.reward.xp}</p>
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
      className="z-10 fixed -translate-y-[calc(100%_+_10px)] -translate-x-1/2"
      style={{
        top: inPx(top),
        left: inPx(left + targetRef.current.offsetWidth / 2),
      }}
    >
      <Box width={130} height={80} size={0.5} rarity="common">
        <div
          className="absolute w-full h-full z-10 blur-sm"
          style={{
            backgroundImage: `url('/${textureByRarity("rare")}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        {children}
      </Box>
    </div>,
    home,
  );
}

import useGameMetadataStore from "@/game/stores/gameMetadataStore";
import { Button } from "../../Home";
import Badge from "@/home/ui/Badge";
import * as _ from "lodash";
import useScrollCardList from "../deck/useScrollCardList";
import { preventDefault } from "@/lib/eventUtils";
import { cn } from "@/lib/utils";

export default function HomeTab() {
  const setIsInGame = useGameMetadataStore((state) => state.setIsInGame);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-4xl font-stylised">Crabvor Island</div>
      <div
        className="w-1/2 aspect-square relative"
        style={{
          backgroundImage: "url('/worlds/1.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Badge
          className="absolute z-10 right-0 top-0"
          value="1"
          rarity="epic"
        />
      </div>
      <Levels />
      <Button action={() => setIsInGame(true)}>New game</Button>
    </div>
  );
}

function Levels() {
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    1,
    9
  );

  const currentLevel = (currentPosition % 9) + 1;
  const currentWorld = Math.floor(currentPosition / 9) + 1;

  return (
    <div
      className=" w-[350px] h-[105px] flex flex-col justify-end select-none relative"
      style={{
        WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)"
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
          {_.range(76).map((index) => {
            const start = 8 * (currentLevel - 1) - 8;
            const end = 8 * currentLevel + 12;
            const exact = (index: number) => index === start || index === (end -1) || index === 0 || index === 75;

            return (
              <circle
                cx={index * 12.5 + 6}
                cy={2}
                r={4}
                key={index}
                fill="white"
                style={{ transition: "ease-in-out 0.5s" }}
                // opacity={exact(index) ? 0.5 : index >= start && index <= end ? 1 : 0}
              />
            );
          })}
        </svg>
        {_.range(1, 10).map((level) => (
          <Level
            key={level}
            level={level}
            world={currentWorld}
            distance={level - currentLevel}
            selected={level === currentLevel}
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
}

function Level({ level, world, selected, distance }: LevelProps) {
  const outside = Math.abs(distance) > 1;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 drop-shadow-[1px_1px_1px_black] px-[12px] w-[100px]"
      )}
      style={{
        transform: `translateX(${25}px)`,
        transition: "ease-in-out 0.5s",
        transitionProperty: "transform, opacity",
        opacity: outside ? 0 : 1,
      }}
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
    </div>
  );
}

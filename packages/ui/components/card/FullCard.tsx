import { getImageEffects } from "../../lib/getImageEffects";
import { cn, inPx } from "../../lib/utils";
import ManaBall from "../ManaBall";
import { CardType } from "./Card";
import CardBorder, { CardContentIllustartion, InnerBord } from "./CardBorder";
import * as _ from "lodash";

export default function FullCard({
  card,
  className,
  size = 1,
  cardShards,
}: {
  card: CardType;
  className?: string;
  size: number;
  cardShards?: {
    shards: number;
    maxShards: number;
  }
}) {
  const effectToShow = getImageEffects(card.effects);

  return (
    <div
      className={cn("box-content", className)}
      style={{
        width: inPx(320 * size),
        height: inPx(445 * size),
      }}
    >
      <div
        className="select-none w-min top-0 left-0 origin-top-left"
        style={{
          transform: `scale(${size * 100}%)`,
        }}
      >
        <CardBorder rarity={card.rarity} size={5}>
          <div className="w-full h-full flex flex-col">
            <div className="absolute top-0 w-full h-full flex flex-col justify-between">
              <div>
                <div className="flex">
                  <InnerBord size={3}>
                    <div className="grow bg-slate-50 px-2 font-stylised text-xl h-min">
                      {card.name}
                    </div>
                  </InnerBord>
                  <div className="absolute right-0 z-10">
                    <svg
                      className="h-full absolute left-0 -translate-x-full"
                      viewBox="0 0 32 32"
                    >
                      <polygon points="0,0 32,32 32,0" fill="black" />
                    </svg>
                    <div className=" bg-black text-white text-[2rem] font-[stylised] leading-[2rem] px-4 pl-2 py-[5px]">
                      {card.level}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full grow overflow-hidden relative pt-2 ">
                <div className="flex flex-col items-end gap-2 absolute top-5 z-10 right-2">
                  {effectToShow.map((effectSrc) => (
                    <div
                      className="p-2 bg-slate-100 border-2 border-black rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"
                      key={effectSrc}
                    >
                      <img src={`/${effectSrc}`} width={22} height={22} />
                    </div>
                  ))}
                </div>
                <CardContentIllustartion card={card} size={3} />
              </div>
              {cardShards && (
                <div className="pt-2 relative">
                  <div className="flex gap-2 justify-center">
                    {_.range(cardShards.maxShards).map((i) => (
                      <img
                        key={i}
                        id={`shard_${i}`}
                        src="/ruby.png"
                        className={cn(
                          "w-4 h-4 bg-transparent",
                          i % 2 ? "-translate-y-[3px]" : "",
                          i > cardShards.shards - 1
                            ? "brightness-0"
                            : "drop-shadow-[1px_1px_1px_black]",
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 w-full pt-2 gap-2">
                <StatLine title="Force" value={card.dmg} />
                <StatLine title="Life" value={card.hp} />
                <StatLine title="Speed" value={card.attackSpeed} />
              </div>
            </div>
          </div>
        </CardBorder>
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[150%]">
          <ManaBall mana={card.cost} />
        </div>
      </div>
    </div>
  );
}

interface StateLineProps {
  className?: string;
  title: string;
  value: number;
}

function StatLine({ className, title, value }: StateLineProps) {
  return (
    <div className={cn("text-sm", className)}>
      <InnerBord size={3}>
        <div className=" bg-slate-50 flex pb-[2px] justify-between items-center flex-col">
          <p className="text-nowrap font-stylised text-base">{title}</p>
          <p className="font-stylised text-sm">
            {Math.round(value * 100) / 100}
          </p>
        </div>
      </InnerBord>
    </div>
  );
}

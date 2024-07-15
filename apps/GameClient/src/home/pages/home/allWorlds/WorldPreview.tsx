import { getCardFromLevel } from "@/cards";
import useDataStore from "@/cards/DataStore";
import usePlayerStore from "@/home/store/playerStore";
import { useState } from "react";
import WorldModal from "../modals/WorldModal";
import { Badge, Button, cn, Cover, getImageUrl } from "@repo/ui";
import StaticCard from "@/game/gui/card/StaticCard";
import { Tier } from "@/home/store/tiers";

export default function WorldPreview({
  tier,
}: {
  tier: Tier;
}) {
  const [isWorldModalOpen, setIsWorldModalOpen] = useState(false);
  const world = useDataStore((state) => state.worlds[tier.world - 1]!);
  const cards = useDataStore((state) => state.cards)
    .filter((card) => card.world === world.id)
    .map((card) => getCardFromLevel(card, 3));
  const { playerTrophies } = usePlayerStore((state) => ({
    playerTrophies: state.trophies,
  }));

  const worldTrophies = (world.id - 1) * 1000;

  const isUnlocked = worldTrophies <= playerTrophies;

  return (
    <>
      <div
        className={`trophiesField worldField${world.id} flex flex-col relative items-center w-full justify-center`}
      >
        {isWorldModalOpen && (
          <WorldModal closeModal={() => setIsWorldModalOpen(false)} />
        )}

        <div className="flex flex-col relative items-center gap-2 w-full py-4 justify-center">
          <div className="absolute w-full h-full bg-slate-400 opacity-20" />
          <div className="flex flex-col relative items-center gap-2 w-[400px]">
            <img
              className={cn(
                `worldFieldIllustration${world.id}`,
                "w-[350px] aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)] cursor-pointer",
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
                  size={0.85}
                  key={card.id}
                  isDisabled={!isUnlocked}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

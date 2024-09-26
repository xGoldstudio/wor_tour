import usePlayerStore from "@/home/store/playerStore/playerStore";
import { dailyGoldService, matchmakingService } from "@/services/inject";
import Timer from "@/services/LoopService/Timer";
import { getImageUrl, ICONS } from "@repo/lib";
import { cn, Cover } from "@repo/ui";
import { useEditionMode } from "../deck/context/UseEditionMode";

interface BattleButtonProps {
	setCurrentTab?: (tab: "deck") => void;
}

export default function BattleButton({ setCurrentTab }: BattleButtonProps) {
  const { setEditionMode } = useEditionMode();

  const { dailyGoldConsumed, dailyGoldLimit } = dailyGoldService.store(
    (state) => ({
      dailyGoldConsumed: state.dailyGoldConsumed,
      dailyGoldLimit: state.dailyGoldLimit,
    })
  );
	const { isDeckFull } = usePlayerStore((state) => ({
    isDeckFull: state.isDeckFull(),
  }));

  return (
    <div
      id="battleButton"
      className={cn(
        "relative rounded-sm flex p-1 flex-col items-center font-slate-600 cursor-pointer w-[310px]",
        !isDeckFull && "brightness-75"
      )}
      onClick={() => {
        if (isDeckFull) {
          matchmakingService.startGame();
          return;
        }
        setCurrentTab!("deck");
        setEditionMode(true);
      }}
    >
      {isDeckFull ? (
        <Cover cardRarity="epic" className="rounded-sm" />
      ) : (
        <>
          <div className="h-7 w-3/5 flex items-center justify-center absolute -top-7 bg-gray-800  backdrop-blur-sm opacity-80 rounded-t-sm font-bold text-white">
            Deck Incomplete
          </div>
          <Cover cardRarity="rare" className="rounded-sm" />
        </>
      )}
      <div className="relative rounded-sm w-full flex justify-center py-2 mx-4">
        <div
          className={cn(
            "bg-white w-full h-full absolute top-0 backdrop-blur-sm opacity-50 rounded-sm",
            !isDeckFull && "bg-gray-800"
          )}
        ></div>
        {!isDeckFull && (
          <img
            src={getImageUrl(ICONS, "padlock-nobg.png")}
            className="h-[22px] absolute top-1/2 -translate-y-1/2 left-12 brightness-75"
            alt="padlock"
          />
        )}
        <p className="text-2xl relative font-bold">Adventure</p>
      </div>
      <div className="relative flex items-center gap-3 justify-start w-full pl-16">
        <img
          src={getImageUrl(ICONS, "/money.png")}
          className="h-[48px] drop-shadow-[2px_1px_1px_black]"
        />
        <div className="relative">
          <p className="text-sm font-semibold leading-4">
            {dailyGoldConsumed}/{dailyGoldLimit}
          </p>
          <p className="text-sm leading-4">
            reset in: <Timer name="dailyGold" />
          </p>
        </div>
      </div>
    </div>
  );
}

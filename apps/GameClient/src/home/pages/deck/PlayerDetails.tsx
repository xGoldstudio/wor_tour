import { getDeckStrength } from "@/services/MatchmakingService/buildDeck";
import { getImageUrlCssValue, ICONS, numberWithCommas } from "@repo/lib";
import { CardType } from "game_engine";

export default function PlayerDetails({ deck }: { deck: CardType[] }) {
  return (
    <div className="w-full h-full flex justify-center items-center grow relative">
      <div className="w-full h-full absolute justify-center items-center flex overflow-hidden">
        <div className="h-[50%] max-h-[128px] aspect-square relative">
          <div
						className="w-full aspect-square brightness-[95%]"
						style={{
							backgroundImage: getImageUrlCssValue(ICONS, "heart.png"),
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right",
						}}
        ></div>
        </div>
				<p className="text-slate-50 text-[2.5em]">{numberWithCommas(Math.floor(getDeckStrength(deck) * 1000))} HP</p>
      </div>
    </div>
  );
}

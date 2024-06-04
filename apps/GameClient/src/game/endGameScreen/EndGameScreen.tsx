import { Badge, Button, textureByRarity } from "@repo/ui";
import useGameMetadataStore from "../stores/gameMetadataStore";
import useGameStore from "../stores/gameStateStore";
import Ribbon from "@/home/ui/Ribbon";
import { Header } from "@/home/Home";
import { EmptyBar } from "../gui/ManaBar";
import BoosterIllustration from "@/home/pages/shop/BoosterIllustration";
import * as _ from "lodash";
import RewardBox from "./RewardBox";

export default function EndGameScreen() {
  const { reset: resetMetadata } = useGameMetadataStore((state) => ({
    reset: state.reset,
  }));
  const { currentWinner } = useGameStore((state) => ({
    currentWinner: state.currentWinner,
  }));

  const isWinner = currentWinner === "player";

  if (!currentWinner) {
    return null;
  }

  return (
    <div className="w-screen h-full flex justify-center">
      <div className="w-[700px] h-full overflow-hidden flex flex-col items-center relative">
        <div
          className="w-full h-full absolute brightness-75"
          style={{
            backgroundImage: "url('/homeBg.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full absolute bg-[linear-gradient(0deg,_rgba(226,232,240,0.2)_0%,_rgba(226,232,240,0)_100%),_linear-gradient(0deg,_rgba(226,232,240,0)_50%,_rgba(226,232,240,1)_70%)]" />
        </div>
        <Header />
        <div className="grow flex flex-col items-center pt-32 relative">
          {isWinner && <ShinyRotator />}
          <Ribbon className="mb-0 relative top-[1px] z-10">{isWinner ? "Victory" : "Defeat"}</Ribbon>
          <div className="flex flex-col gap-8 items-center mb-6 py-8 w-[450px] rounded-b-sm relative bg-slate-100 overflow-hidden">
            <div
              className="absolute w-full h-full top-0 left-0 blur-sm"
              style={{
                backgroundImage: `url(/${textureByRarity(isWinner ? "rare" : "common")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="flex gap-6 items-center relative">
							<RewardBox amount={1}>
                <BoosterIllustration
                  size={0.4}
                  title="Victory reward"
                  illustration=""
                />
              </RewardBox>
							<RewardBox amount={15000}>
                <img src="/money.png" className="h-[100px]" />
              </RewardBox>
            </div>
            <div className="flex gap-2 w-[350px] items-center relative">
              <Badge value="1" />
              <div className="grow h-6 bg-slate-50 rounded-sm overflow-hidden">
                <EmptyBar></EmptyBar>
              </div>
            </div>
          </div>
          <Button action={resetMetadata} className="w-[450px]">Continue</Button>
        </div>
      </div>
    </div>
  );
}

function ShinyRotator() {
  return (
    <div className="w-screen h-screen absolute top-1/2 -translate-y-[600px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute top-0 left-1/2 h-full -translate-x-1/2 drop-shadow-[0px_0px_15px_white] scale-150"
      >
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="40%" stopColor="white" stopOpacity={0} />
            <stop offset="60%" stopColor="white" stopOpacity={0.5} />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <linearGradient id="legendaryGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="40%" stopColor="#DFFCD3" stopOpacity={0} />
            <stop offset="60%" stopColor="#1D7BFA" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#F02BD4" />
          </linearGradient>
        </defs>

        {_.range(8).map((index) => (
          <polygon
            key={index}
            points="50,50 10,0 0,10"
            fill={`url(${"#gradient"})`}
            transform={`rotate(${index * (360 / 8)} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}

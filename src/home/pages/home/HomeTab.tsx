import useGameMetadataStore from "@/game/stores/gameMetadataStore";
import { Button } from "../../Home";

export default function HomeTab() {
  const setIsInGame = useGameMetadataStore(state => state.setIsInGame);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className="w-1/2 aspect-square blur-[1px] border-[0px] border-black"
        style={{
          backgroundImage: "url('/worlds/1.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      <p className="font-[stylised] font-bold text-2xl text-white">
        World 1 - Level 1
      </p>
      <Button action={() => setIsInGame(true)}>Play</Button>
    </div>
  );
}

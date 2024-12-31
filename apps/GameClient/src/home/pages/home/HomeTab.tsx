import AllWorlds from "./allWorlds/AllWorlds";
import AnimationContainer from "@/home/animations/AnimationContainer";
import WorldIllustration from "./WorldIllustration";
import { Tabs } from "@/home/Home";
import useClientInterfaceStore from "@/home/store/clientInterfaceStore";
import BattleButton from "./BattleButton";

interface HomeTabProps {
  setCurrentTab?: (tab: Tabs) => void;
}

export default function HomeTab({ setCurrentTab }: HomeTabProps) {
  const { worldsModalOpen, setWorldsModalOpen } = useClientInterfaceStore(
    (state) => ({
      worldsModalOpen: state.worldsModalOpen,
      setWorldsModalOpen: state.setWorldsModalOpen,
    })
  );

  return (
    <div className="w-full max-w-[700px] h-full flex flex-col items-center">
      <AnimationContainer />
      {worldsModalOpen && (
        <AllWorlds
          closeModal={() => setWorldsModalOpen(false)}
          state={worldsModalOpen}
        />
      )}
      <div className="flex flex-col items-center grow justify-center gap-16">
        <WorldIllustration
          setWorldsModalOpen={() => setWorldsModalOpen("normal")}
        />
        <BattleButton setCurrentTab={setCurrentTab} />
      </div>
    </div>
  );
}

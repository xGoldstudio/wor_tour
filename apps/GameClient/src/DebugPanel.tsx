import { useState } from "react";
import { DebugButton } from "./game/GameDebugPanel";
import useAnimationStore from "./home/store/animationStore";
import usePlayerStore from "./home/store/playerStore/playerStore";
import { _warningResetPlayStore } from "./home/store/initAllClientData";
import clientLoop from "./home/services/LoopService/clientLoop";

export default function DebugPanel() {
  const { addGold, setTrophies } = usePlayerStore((state) => ({
    addGold: state.addGold,
    setTrophies: state.addOrRemoveTrophies,
  }));

  const addTrophies = (amount: number) =>
    useAnimationStore.getState().addAnimation({
      type: "trophy",
      previousValue: usePlayerStore.getState().trophies,
      amount,
    });

  const [confirmationResetPlayer, setConfirmationResetPlayer] = useState(false);

  return (
    <div className="fixed right-2 top-2 border-2 border-white text-white px-4 py-2 flex flex-col gap-4">
      <div className="flex gap-4">
        <DebugButton onClick={() => addGold(1000)}>Give 1000 gold</DebugButton>
        <DebugButton onClick={() => addGold(1000000)}>
          Give 1 000 000 gold
        </DebugButton>
      </div>
      <p>Trophies: </p>
      <div className="grid grid-cols-4 gap-4">
        <DebugButton onClick={() => addTrophies(1000)}>+1000</DebugButton>
        <DebugButton onClick={() => addTrophies(100)}>+100</DebugButton>
        <DebugButton onClick={() => addTrophies(10)}>+10</DebugButton>
        <DebugButton onClick={() => addTrophies(1)}>+1</DebugButton>
        <DebugButton onClick={() => setTrophies(-1000)}>-1000</DebugButton>
        <DebugButton onClick={() => setTrophies(-100)}>-100</DebugButton>
        <DebugButton onClick={() => setTrophies(-10)}>-10</DebugButton>
        <DebugButton onClick={() => setTrophies(-1)}>-1</DebugButton>
        <DebugButton onClick={() => setTrophies(100)}>+100</DebugButton>
      </div>
      <p>Event Clock: </p>
      <div className="grid grid-cols-2 gap-4">
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(10*60)}>
          Fast Forward 10 minutes
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(60*60)}>
        Fast Forward 1 hours
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(60*60*24)}>
        Fast Forward 1 day
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(7*60*60*24)}>
        Fast Forward 1 week
        </DebugButton>
      </div>
      <p className="text-red-600">Danger zone:</p>
      <div className="grid grid-cols-2 gap-4 border-4 border-red-600 text-red-600 p-2">
        {confirmationResetPlayer ? (
          <>
            <p className="col-span-2">Are you sure to reset player?</p>
            <DebugButton onClick={() => setConfirmationResetPlayer(false)}>
              No
            </DebugButton>
            <DebugButton
              onClick={() => {
                _warningResetPlayStore();
                setConfirmationResetPlayer(false);
              }}
            >
              Yes
            </DebugButton>
          </>
        ) : (
          <DebugButton onClick={() => setConfirmationResetPlayer(true)}>
            Reset Player
          </DebugButton>
        )}
      </div>
    </div>
  );
}

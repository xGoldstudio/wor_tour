import { useState } from "react";
import usePlayerStore, {
  CollectionCard,
} from "./home/store/playerStore/playerStore";
import { _warningResetPlayStore } from "./home/store/initAllClientData";
import useDataStore from "./cards/DataStore";
import useRewardStore from "./home/store/rewardStore";
import { GameStateObject } from "game_engine";
import {
  clientLoop,
  dailyGoldService,
  experienceService,
  matchmakingService,
} from "./services/inject";
import DebugButton from "./debug/DebugButton";
import DebugSection from "./debug/DebugSection";
import { CornerUpLeft } from "lucide-react";
import usePersistentState from "./debug/usePersistentState";
import { cn, useOnMount, useOnUnMount } from "@repo/ui";
import { useTimerStateSecond } from "./services/LoopService/Timer";

export default function DebugPanel() {
  const { addGold, setTrophies } = usePlayerStore((state) => ({
    addGold: state.addGold,
    setTrophies: state.addOrRemoveTrophies,
  }));
  const isPvp = useDataStore((state) => state.isPvp);
  const isMirror = matchmakingService.wathcIsMirror();

  const addTrophies = (amount: number) =>
    usePlayerStore.getState().addOrRemoveTrophies(amount);

  const [confirmationResetPlayer, setConfirmationResetPlayer] = useState(false);

  function giveAllCards() {
    const maxedCollection: Map<number, CollectionCard> = new Map();
    for (let i = 1; i <= useDataStore.getState().cards.length; i++) {
      maxedCollection.set(i, { id: i, level: 3, shard: 0 });
    }
    usePlayerStore.setState({
      collection: maxedCollection,
    });
  }

  function addKeyReward() {
    useRewardStore.getState().addReward({ type: "key" });
  }

  function addKeysReward() {
    useRewardStore.getState().addReward({ type: "keys" });
  }

  const instantWinGame = () => {
    matchmakingService.startGame();
    const gameObject = new GameStateObject({
      playerDeck: [],
      opponentDeck: [],
      playerHp: 1,
      opponentHp: 1,
    });
    gameObject.setGameOver("player");
    matchmakingService.endGame(gameObject);
  };

  const [isOpen, setIsOpen] = usePersistentState("debug-panel-open", false);

  const [isShow, setIsShow] = usePersistentState<boolean>("debug-panel-show", true);

  const { dailyGoldConsumed, dailyGoldLimit } = dailyGoldService.store(
    (state) => ({
      dailyGoldConsumed: state.dailyGoldConsumed,
      dailyGoldLimit: state.dailyGoldLimit,
    })
  );
  const remainingTimeDailyGoldRewards = useTimerStateSecond("dailyGold");

  function toggleDebugPanel(e: KeyboardEvent) {
    if (e.key === " ") {
      setIsShow (prev => !prev);
    }
  }

  useOnMount(() => {
    window.addEventListener("keydown", toggleDebugPanel);
  });

  useOnUnMount(() => {
    window.removeEventListener("keydown", toggleDebugPanel);
  });

  if (!isShow) {
    return <></>;
  }

  return (
    <div className={cn("fixed right-0 top-0 text-white h-screen overflow-y-auto bg-slate-900 z-[9999] w-[470px]", !isOpen && "w-min")}>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-end pt-4 px-4">
          <CornerUpLeft
            className={cn("cursor-pointer transition-transform", isOpen && "transform rotate-180")}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {isOpen && (
          <>
            <DebugSection title={"Gold"}>
              <div className="flex gap-4">
                <DebugButton onClick={() => useRewardStore.getState().addReward({ type: "rawGold", amount: 100 })}>
                  Give 100 gold
                </DebugButton>
                <DebugButton onClick={() => addGold(1000)}>
                  Give 1000 gold
                </DebugButton>
                <DebugButton onClick={() => addGold(1000000)}>
                  Give 1 000 000 gold
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title={"Trophies"}>
              <div className="grid grid-cols-4 gap-4">
                <DebugButton onClick={() => addTrophies(1000)}>
                  +1000
                </DebugButton>
                <DebugButton onClick={() => addTrophies(100)}>+100</DebugButton>
                <DebugButton onClick={() => addTrophies(10)}>+10</DebugButton>
                <DebugButton onClick={() => addTrophies(1)}>+1</DebugButton>
                <DebugButton onClick={() => setTrophies(-1000)}>
                  -1000
                </DebugButton>
                <DebugButton onClick={() => setTrophies(-100)}>
                  -100
                </DebugButton>
                <DebugButton onClick={() => setTrophies(-10)}>-10</DebugButton>
                <DebugButton onClick={() => setTrophies(-1)}>-1</DebugButton>
                <DebugButton onClick={() => useRewardStore.getState().addReward({ type: "rawTrophies", amount: 100 })}>+100</DebugButton>
                <DebugButton onClick={() => useRewardStore.getState().addReward({ type: "rawTrophies", amount: 1000 })}>+1000</DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Gold daily reward">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton onClick={() => console.log(`${dailyGoldConsumed}/${dailyGoldLimit}, reset in ${remainingTimeDailyGoldRewards}s`)}>
                  Log
                </DebugButton>
                <DebugButton onClick={() => dailyGoldService.reset()}>
                  Reset
                </DebugButton>
                <DebugButton onClick={() => dailyGoldService.earnReward(dailyGoldLimit - dailyGoldConsumed)}>
                  Earn full
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Experience">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton onClick={() => experienceService.gainExperience()}>
                  Gain experience
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Rewards">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton
                  onClick={() => useRewardStore.getState().removeAllRewards()}
                >
                  Clear rewards
                </DebugButton>
                <DebugButton onClick={() => addKeyReward()}>
                  Key reward
                </DebugButton>
                <DebugButton onClick={() => addKeysReward()}>
                  Keys reward
                </DebugButton>
                <DebugButton onClick={instantWinGame}>
                  Instant win game
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Event clock">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton
                  onClick={() => clientLoop._unsafeManipulateClock(1)}
                >
                  Fast Forward 1 second
                </DebugButton>
                <DebugButton
                  onClick={() => clientLoop._unsafeManipulateClock(10)}
                >
                  Fast Forward 10 seconds
                </DebugButton>
                <DebugButton
                  onClick={() => clientLoop._unsafeManipulateClock(60)}
                >
                  Fast Forward 1 minutes
                </DebugButton>
                <DebugButton
                  onClick={() => clientLoop._unsafeManipulateClock(10 * 60)}
                >
                  Fast Forward 10 minutes
                </DebugButton>
                <DebugButton
                  onClick={() => clientLoop._unsafeManipulateClock(60 * 60)}
                >
                  Fast Forward 1 hours
                </DebugButton>
                <DebugButton
                  onClick={() =>
                    clientLoop._unsafeManipulateClock(60 * 60 * 24)
                  }
                >
                  Fast Forward 1 day
                </DebugButton>
                <DebugButton
                  onClick={() =>
                    clientLoop._unsafeManipulateClock(7 * 60 * 60 * 24)
                  }
                >
                  Fast Forward 1 week
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Collection">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton onClick={() => giveAllCards()}>
                  Give all cards
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Matchmaking">
              <div className="grid grid-cols-2 gap-4">
                <DebugButton
                  onClick={() =>
                    useDataStore
                      .getState()
                      .setIsPvp(!useDataStore.getState().isPvp)
                  }
                  selected={isPvp}
                >
                  Mode pvp
                </DebugButton>
                <DebugButton
                  onClick={() => matchmakingService.toggleMirror()}
                  selected={isMirror}
                >
                  Mirror
                </DebugButton>
              </div>
            </DebugSection>
            <DebugSection title="Danger zone" dangerous>
              <div className="grid grid-cols-2 gap-4">
                {confirmationResetPlayer ? (
                  <>
                    <p className="col-span-2">Are you sure to reset player?</p>
                    <DebugButton
                      onClick={() => setConfirmationResetPlayer(false)}
                    >
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
            </DebugSection>
          </>
        )}
      </div>
    </div>
  );
}

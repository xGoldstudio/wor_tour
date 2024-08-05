import { useState } from "react";
import { DebugButton } from "./game/GameDebugPanel";
import useAnimationStore from "./home/store/animationStore";
import usePlayerStore, {
  CollectionCard,
} from "./home/store/playerStore/playerStore";
import { _warningResetPlayStore } from "./home/store/initAllClientData";
import useDataStore from "./cards/DataStore";
import useRewardStore from "./home/store/rewardStore";
import { clientLoop, matchmakingService } from "./home/services/inject";
import { GameStateObject } from "game_engine";

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
    const gameObject = new GameStateObject({ playerDeck: [], opponentDeck: [], playerHp: 1, opponentHp: 1 });
    gameObject.setGameOver(true);
    matchmakingService.endGame(gameObject);
  };

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
      <p>Rewards</p>
      <div className="grid grid-cols-2 gap-4">
      <DebugButton onClick={() => useRewardStore.getState().removeAllRewards()}>Clear rewards</DebugButton>
        <DebugButton onClick={() => addKeyReward()}>Key reward</DebugButton>
        <DebugButton onClick={() => addKeysReward()}>Keys reward</DebugButton>
        <DebugButton onClick={instantWinGame}>Instant win game</DebugButton>
      </div>
      <p>Event Clock: </p>
      <div className="grid grid-cols-2 gap-4">
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(1)}>
          Fast Forward 1 second
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(10)}>
          Fast Forward 10 seconds
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(60)}>
          Fast Forward 1 minutes
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(10 * 60)}>
          Fast Forward 10 minutes
        </DebugButton>
        <DebugButton onClick={() => clientLoop._unsafeManipulateClock(60 * 60)}>
          Fast Forward 1 hours
        </DebugButton>
        <DebugButton
          onClick={() => clientLoop._unsafeManipulateClock(60 * 60 * 24)}
        >
          Fast Forward 1 day
        </DebugButton>
        <DebugButton
          onClick={() => clientLoop._unsafeManipulateClock(7 * 60 * 60 * 24)}
        >
          Fast Forward 1 week
        </DebugButton>
      </div>
      <p>Collection: </p>
      <div className="grid grid-cols-2 gap-4">
        <DebugButton onClick={() => giveAllCards()}>Give all cards</DebugButton>
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

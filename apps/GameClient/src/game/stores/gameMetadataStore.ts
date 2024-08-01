import { findCard } from "@/cards";
import { create } from "zustand";
import useGameStore from "./gameStateStore";
import useAnimationStore from "../../home/store/animationStore";
import { CardType, getTargetStrength } from "@repo/lib";
import useClientInterfaceStore from "@/home/store/clientInterfaceStore";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { GameStateObjectConstructor } from "game_engine";
import { Tier } from "@/home/store/tiers";
import useDataStore from "@/cards/DataStore";
import buildDeck, { getDeckStrength } from "./buildDeck";
import { dailyGoldService } from "@/home/services/DailyGoldService/dailyGoldService";

interface GameRewards {
  win: {
    money: number;
    trophies: number;
  },
  lose: {
    money: number;
    trophies: number;
  }
}

interface GameInterfaceStore {
  isInGame: boolean;
  playerCards: CardType[];
  opponentCards: CardType[];
  playerHp: number;
  opponentHp: number;
  rewards: GameRewards,
  getInGameInitData: () => GameStateObjectConstructor;
  setIsInGame: (isInGame: boolean) => void;
  setInGameData: (
    playerCards: CardType[],
    opponentCards: CardType[],
    playerHp: number,
    opponentHp: number,
    rewards: GameRewards,
  ) => void;
  collectRewards: () => void;
  reset: () => void;
}

const useGameMetadataStore = create<GameInterfaceStore>()((set, get) => ({
  isInGame: false,
  playerCards: [],
  opponentCards: [],
  playerHp: 1000,
  opponentHp: 1000,
  rewards: {
    win: {
      money: 0,
      trophies: 0
    },
    lose: {
      money: 0,
      trophies: 0
    }
  },
  setInGameData: (
    playerCards: CardType[],
    opponentCards: CardType[],
    playerHp: number,
    opponentHp: number,
    gameRewards: GameRewards,
  ) => {
    set({ playerCards, opponentCards, playerHp, opponentHp, isInGame: true, rewards: gameRewards });
  },
  getInGameInitData: () => ({
    playerDeck: [...get().playerCards.values()].map((card) => findCard(card.id, card.level)),
    opponentDeck: [...get().opponentCards.values()].map((card) => findCard(card.id, card.level)),
    playerHp: get().playerHp,
    opponentHp: get().opponentHp,
  }),
  setIsInGame: (isInGame: boolean) => set({ isInGame }),
  collectRewards: () => {
    const isWin = useGameStore.getState().state.currentWinner === "player";
    const rewards = get().rewards[isWin ? "win" : "lose"];
    dailyGoldService.earnReward(isWin);
    if (rewards.money > 0) {
      useAnimationStore.getState().addAnimation({
        type: "money",
        previousValue: usePlayerStore.getState().gold,
        amount: rewards.money,
      });
    }
    if (rewards.trophies > 0) {
      useAnimationStore.getState().addAnimation({
        type: "trophy",
        previousValue: usePlayerStore.getState().trophies,
        amount: rewards.trophies,
        onEnd: () => useClientInterfaceStore.getState().setWorldsModalOpen(hasChangeWorldOrTier),
      });
    }
    const hasChangeWorldOrTier = usePlayerStore.getState().addOrRemoveTrophies(rewards.trophies);
    usePlayerStore.getState().addGold(rewards.money);
  },
  reset: () => set({ isInGame: false }),
}));

const MAX_TROPHIES_WIN = 35;
const LOWEST_TROPHIES_WIN = 25;

export function useStartGame() {
  const { deck } = usePlayerStore((state) => ({ deck: state.deck }));
  const { setInGameData } = useGameMetadataStore((state) => ({
    setInGameData: state.setInGameData,
  }));

  function startGame() {
    const playerDeck: CardType[] = deck.map((cardId) => findCard(cardId, usePlayerStore.getState().getCollectionInfo(cardId)!.level));
    const cardPool = getCardsPoolFromTier(usePlayerStore.getState().getCurrentTier());
    const targetStrength = usePlayerStore.getState().getCurrentTier().level.strength;
    const previousTierStrength = usePlayerStore.getState().getPreviousTier().level.strength;
    const randomValueBetween = Math.random() * (targetStrength - previousTierStrength) + previousTierStrength;
    const opponentDeck = buildDeck(randomValueBetween, 0.2, cardPool);
    const maxGap = targetStrength - previousTierStrength;
    const currentGap = targetStrength - randomValueBetween;
    const trophiesGap = Math.round((currentGap / maxGap) * (MAX_TROPHIES_WIN - LOWEST_TROPHIES_WIN));
    setInGameData(
      playerDeck, opponentDeck, getHpFromDeck(playerDeck), getHpFromDeck(opponentDeck),
      {
        win: {
          money: dailyGoldService.getGoldWinReward(),
          trophies: MAX_TROPHIES_WIN - trophiesGap,
        },
        lose: {
          money: dailyGoldService.getGoldLoseReward(),
          trophies: -(LOWEST_TROPHIES_WIN + trophiesGap),
        }
      },
    );
  }

  return startGame;
}

export default useGameMetadataStore;

function getHpFromDeck(deck: CardType[]) {
  return Math.round(getDeckStrength(deck) * 100);
}

function getCardsPoolFromTier(tier: Tier) {
  const pool: [number, CardType][] = [];
  useDataStore.getState().cards.forEach(card => {
    if (card.world > tier.world) return;
    for (let i = 0; i < 3; i++) {
      const cardType = findCard(card.id, i + 1);
      pool.push([getTargetStrength(cardType), cardType]);
    }
  });
  return pool.sort((a, b) => a[0] - b[0]);
}
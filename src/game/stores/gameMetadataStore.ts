import { CardType, findCard } from '@/cards';
import usePlayerStore, { CollectionCard } from '@/home/store/playerStore';
import { create } from 'zustand';

export interface InGameInitData {
  playerDeck: number[];
  opponentDeck: number[];
  playerHp: number;
  opponentHp: number;
}

interface GameInterfaceStore {
  isInGame: boolean;
  playerCards: Map<number, CollectionCard>;
  opponentCards: Map<number, CollectionCard>;
  playerHp: number;
  opponentHp: number;
  getInGameInitData: () => InGameInitData;
  findCard: (id: number, isPlayer: boolean) => CardType;
  setIsInGame: (isInGame: boolean) => void;
  setInGameData: (playerCards: Map<number, CollectionCard>, opponentCards: Map<number, CollectionCard>, playerHp: number, opponentHp: number) => void;
  reset: () => void;
}

const useGameMetadataStore = create<GameInterfaceStore>()((set, get) => ({
  isInGame: false,
  playerCards: new Map<number, CollectionCard>(),
  opponentCards: new Map<number, CollectionCard>(),
  playerHp: 1000,
  opponentHp: 1000,
  setInGameData: (playerCards: Map<number, CollectionCard>, opponentCards: Map<number, CollectionCard>, playerHp: number, opponentHp: number) => {
    set({ playerCards, opponentCards, playerHp, opponentHp, isInGame: true });
  },
  getInGameInitData: () => ({
    playerDeck: Array.from(get().playerCards.keys()),
    opponentDeck: Array.from(get().opponentCards.keys()),
    playerHp: get().playerHp,
    opponentHp: get().opponentHp,
  }),
  findCard: (id: number, isPlayer: boolean) => {
    const collectionCard = isPlayer ? get().playerCards.get(id) : get().opponentCards.get(id);
    if (collectionCard === undefined) throw new Error(`Card with id ${id} not found`);
    return findCard(collectionCard.id, collectionCard.level);
  },
  setIsInGame: (isInGame: boolean) => set({ isInGame }),
  reset: () => set({ isInGame: false }),
}));



export function useStartGame() {
  const { deck } = usePlayerStore(state => ({ deck: state.deck }));
  const { setInGameData } = useGameMetadataStore(state => ({ setInGameData: state.setInGameData }));

  function startGame() {
    const playerDeck = new Map<number, CollectionCard>();
    deck.forEach(cardId => {
      playerDeck.set(cardId, usePlayerStore.getState().getCollectionInfo(cardId));
    });
    const opponentDeck = new Map<number, CollectionCard>(playerDeck);
    // const cardsPool = cards.filter(card => card.world === level.world);

    setInGameData(playerDeck, opponentDeck, 2000, 2000);
  }

  return startGame;
}

export default useGameMetadataStore;
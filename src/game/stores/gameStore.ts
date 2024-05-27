import { CardType, findCard } from '@/cards';
import { CollectionCard } from '@/home/store/playerStore';
import { create } from 'zustand'

interface GameInterfaceStore {
  playerCards: Map<number, CollectionCard>;
  opponentCards: Map<number, CollectionCard>;
  getCards: () => { player: number[]; opponent: number[] };
  findCard: (id: number, isPlayer: boolean) => CardType;
}

const playerCards = new Map<number, CollectionCard>();
playerCards.set(2, { id: 2, level: 1, shard: 0 });
playerCards.set(3, { id: 3, level: 1, shard: 0 });
playerCards.set(4, { id: 4, level: 2, shard: 6 });
playerCards.set(5, { id: 5, level: 1, shard: 0 });
playerCards.set(7, { id: 7, level: 3, shard: 0 });
playerCards.set(8, { id: 8, level: 3, shard: 0 });
playerCards.set(9, { id: 9, level: 3, shard: 0 });

const opponentCards = new Map<number, CollectionCard>();
opponentCards.set(1, { id: 1, level: 1, shard: 0 });
opponentCards.set(2, { id: 2, level: 1, shard: 0 });
opponentCards.set(3, { id: 3, level: 1, shard: 0 });
opponentCards.set(4, { id: 4, level: 2, shard: 6 });
opponentCards.set(5, { id: 5, level: 1, shard: 0 });
opponentCards.set(6, { id: 6, level: 1, shard: 0 });
opponentCards.set(7, { id: 7, level: 1, shard: 0 });
opponentCards.set(8, { id: 8, level: 1, shard: 2 });

const useGameBaseStore = create<GameInterfaceStore>()((set, get) => ({
  playerCards: playerCards,
  opponentCards: opponentCards,
  getCards: () => ({
    player: Array.from(get().playerCards.keys()),
    opponent: Array.from(get().opponentCards.keys()),
  }),
  findCard: (id: number, isPlayer: boolean) => {
    const collectionCard = isPlayer ? get().playerCards.get(id) : get().opponentCards.get(id);
    if (collectionCard === undefined) throw new Error(`Card with id ${id} not found`);
    return findCard(collectionCard.id, collectionCard.level);
  },
}));

export default useGameBaseStore;
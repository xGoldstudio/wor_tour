import { create } from "zustand";

export interface GameStore {
  playerDeck: number[];
  playerHand: (number | null)[];
  playerMana: number;
  playerHp: number;
  playerMaxHp: number;
  playerTimestampStartEarningMana: null | number;

  opponentDeck: number[];
  opponentHand: (number | null)[];
  opponentMana: number;
  opponentHp: number;
  opponentMaxHp: number;
  opponentTimestampStartEarningMana: null | number;

  playerBoard: (InGameCardType | null)[];
  opponentBoard: (InGameCardType | null)[];

  currentWinner: "player" | "opponent" | null; // if not null = game over
  currentInstanceId: number;

  startEarningMana: (isPlayer: boolean) => void;
  increaseMana: (isPlayer: boolean) => void;
  consumeMana: (isPlayer: boolean, amount: number) => void;
  dealDamageToPlayer: (isPlayer: boolean, damage: number) => void;
  dealDamageToCard: (isPlayerCard: boolean, damage: number, cardPosition: number) => boolean;
  destroyCard: (isPlayerCard: boolean, cardPosition: number) => void;
  getData: () => GameStore;
  getBoardCurrentCard: (
    isPlayer: boolean,
    position: number
  ) => InGameCardType | null;
  placeCardBoard: (
    isPlayer: boolean,
    position: number,
    card: InGameCardType
  ) => void;
  startAttacking: (isPlayer: boolean, cardPosition: number) => void;
  setGameOver: (winnerIsPlayer: boolean) => void;
  getNextInstanceId: () => number;
  // deck
  cardDeckToHand: (isPlayer: boolean, targetPosition: number) => void;
  cardHandToDeck: (isPlayer: boolean, handCardPosition: number) => void;
}

export interface InGameCardType {
  id: number;
  instanceId: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number;
  startAttackingTimestamp: number | null;
}

const useGameStore = create<GameStore>()((set, get) => ({
  playerDeck: [1,2,3,4,5,6],
  playerHand: [null, null, null, null],
  playerMana: 7,
  playerHp: 5000,
  playerMaxHp: 5000,
  playerTimestampStartEarningMana: null,

  playerBoard: [null, null, null],

  opponentDeck: [1,2,3,4,5,6],
  opponentHand: [null, null, null, null],
  opponentMana: 7,
  opponentHp: 4000,
  opponentMaxHp: 5000,
  opponentTimestampStartEarningMana: null,

  opponentBoard: [null, null, null],

  // global state
  currentWinner: null,
  currentInstanceId: 0,

  getData: () => get(),
  startEarningMana: (isPlayer: boolean) =>
    set(
      isPlayer
        ? { playerTimestampStartEarningMana: new Date().getTime() }
        : { opponentTimestampStartEarningMana: new Date().getTime() }
    ),
  increaseMana: (isPlayer: boolean) =>
    set((state) =>
      isPlayer
        ? {
            playerMana: state.playerMana + 1,
            playerTimestampStartEarningMana: null,
          }
        : {
            opponentMana: state.opponentMana + 1,
            opponentTimestampStartEarningMana: null,
          }
    ),
  consumeMana: (isPlayer: boolean, amount: number) =>
    set((state) =>
      isPlayer
        ? { playerMana: state.playerMana - amount }
        : { opponentMana: state.opponentMana - amount }
    ),
  dealDamageToPlayer: (isPlayer: boolean, damage: number) =>
    set((state) =>
      isPlayer
        ? { playerHp: state.playerHp - damage }
        : { opponentHp: state.opponentHp - damage }
    ),
  dealDamageToCard: (isPlayerCard: boolean, damage: number, cardPosition: number) => {
    let isDead = false;
    set((state) => {
      const board = isPlayerCard ? [...state.playerBoard] : [...state.opponentBoard];
      const card = board[cardPosition];
      if (card === null) {
        console.warn("Trying to attack unexisting card");
        return {};
      }
      card.hp = Math.max(0, card.hp - damage);
      isDead = card.hp === 0;
      return isPlayerCard ? { playerBoard: board } : { opponentBoard: board };
    });
    return isDead;
  },
  destroyCard: (isPlayerCard: boolean, cardPosition: number) => {
    set((state) => {
      const board = isPlayerCard ? [...state.playerBoard] : [...state.opponentBoard];
      board[cardPosition] = null;
      return isPlayerCard ? { playerBoard: board } : { opponentBoard: board };
    })
  },
  // board
  getBoardCurrentCard: (isPlayer: boolean, position: number) =>
    isPlayer ? get().playerBoard[position] : get().opponentBoard[position],
  placeCardBoard: (isPlayer: boolean, position: number, card: InGameCardType) => {
    if (isPlayer) {
      const newBoard = [...get().playerBoard];
      newBoard[position] = card;
      set({ playerBoard: newBoard });
    } else {
      const newBoard = [...get().opponentBoard];
      newBoard[position] = card;
      set({ opponentBoard: newBoard });
    }
  },
  startAttacking: (isPlayer: boolean, cardPosition: number) => set(state => {
    const board = isPlayer ? state.playerBoard : state.opponentBoard;
    const card = board[cardPosition];
    if (!card) {
      console.warn("Card doesnt exist");
      return {};
    }
    card.startAttackingTimestamp = new Date().getTime();
    return isPlayer ? { playerBoard: board } : { opponentBoard: board };
  }),
  setGameOver: (winnerIsPlayer: boolean) =>
    set({ currentWinner: winnerIsPlayer ? "player" : "opponent" }),
  getNextInstanceId: () => {
    const nextId = get().currentInstanceId + 1;
    set({ currentInstanceId: nextId });
    return nextId;
  },

  cardDeckToHand: (isPlayer: boolean, targetPosition: number) => {
    set(state => {
      const hand = isPlayer ? state.playerHand : state.opponentHand;
      let deck = isPlayer ? [...state.playerDeck] : [...state.opponentDeck];
      if (hand[targetPosition] !== null) {
        console.warn("trying to draw a card on a position where a card already exist, use cardHandToDiscard instead");
        return {};
      }
      hand[targetPosition] = deck[0];
      deck = deck.slice(1);
      return isPlayer
        ? { playerHand: hand, playerDeck: deck }
        : { opponentHand: hand, opponentDeck: deck }
    });
  },
  cardHandToDeck: (
    isPlayer: boolean, handCardPosition: number,
  ) =>
    set(state => {
      const hand = isPlayer ? state.playerHand : state.opponentHand;
      const deck = isPlayer
        ? [...state.playerDeck]
        : [...state.opponentDeck];
      const cardId = hand[handCardPosition];
      if (cardId === null) {
        console.warn("card is already discarded");
        return {};
      }
      hand[handCardPosition] = null;
      deck.push(cardId);
      return isPlayer
        ? { playerHand: hand, playerDeck: deck }
        : { opponentHand: hand, opponentDeck: deck }
    }),
}));

export default useGameStore;
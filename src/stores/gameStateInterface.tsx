import { CardEffects } from "@/cards";
import { create } from "zustand";
import * as _ from "lodash";

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
  dealDamageToCard: (
    isPlayerCard: boolean,
    damage: number,
    cardPosition: number
  ) => boolean;
  healCard: (
    isPlayerCard: boolean,
    cardPosition: number,
    amount: number
  ) => void;
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
  shuffleDeck: (isPlayer: boolean) => void;
  startAttacking: (isPlayer: boolean, cardPosition: number) => void;
  setGameOver: (winnerIsPlayer: boolean) => void;
  getNextInstanceId: () => number;
  // deck
  cardDeckToHand: (isPlayer: boolean, targetPosition: number) => void;
  cardHandToDeck: (isPlayer: boolean, handCardPosition: number) => void;
  // effect
  removeEffect: (
    isPlayerCard: boolean,
    cardPosition: number,
    effectToRemove: keyof CardEffects["effects"]
  ) => void;
}

export type InGameCardType = {
  id: number;
  instanceId: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number;
  startAttackingTimestamp: number | null;
} & CardEffects;

const useGameStore = create<GameStore>()((set, get) => ({
  playerDeck: [1, 2, 3, 4, 5, 6],
  playerHand: [null, null, null, null],
  playerMana: 7,
  playerHp: 3000,
  playerMaxHp: 3000,
  playerTimestampStartEarningMana: null,

  playerBoard: [null, null, null],

  opponentDeck: [1, 2, 3, 4, 5, 6],
  opponentHand: [null, null, null, null],
  opponentMana: 7,
  opponentHp: 3000,
  opponentMaxHp: 3000,
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
  dealDamageToCard: (
    isPlayerCard: boolean,
    damage: number,
    cardPosition: number
  ) => {
    let isDead = false;
    set(
      updateCard(
        isPlayerCard,
        cardPosition,
        (card) => {
          card.hp = Math.max(0, card.hp - damage);
          isDead = card.hp === 0;
          return card;
        },
        "Trying to attack unexisting card"
      )
    );
    return isDead;
  },
  healCard: (isPlayerCard: boolean, cardPosition: number, amount: number) => {
    set(
      updateCard(
        isPlayerCard,
        cardPosition,
        (card) => {
          card.hp = Math.min(card.maxHp, card.hp + amount);
          return card;
        },
        "Trying to heal unexisting card"
      )
    );
  },
  destroyCard: (isPlayerCard: boolean, cardPosition: number) => {
    set(updateCard(isPlayerCard, cardPosition, () => null));
  },
  // board
  getBoardCurrentCard: (isPlayer: boolean, position: number) =>
    isPlayer ? get().playerBoard[position] : get().opponentBoard[position],
  placeCardBoard: (
    isPlayer: boolean,
    position: number,
    card: InGameCardType
  ) => {
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
  startAttacking: (isPlayer: boolean, cardPosition: number) =>
    set((state) => {
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
    set((state) => {
      const hand = isPlayer ? state.playerHand : state.opponentHand;
      let deck = isPlayer ? [...state.playerDeck] : [...state.opponentDeck];
      if (hand[targetPosition] !== null) {
        console.warn(
          "trying to draw a card on a position where a card already exist, use cardHandToDeck instead"
        );
        return {};
      }
      hand[targetPosition] = deck[0];
      deck = deck.slice(1);
      return isPlayer
        ? { playerHand: hand, playerDeck: deck }
        : { opponentHand: hand, opponentDeck: deck };
    });
  },
  cardHandToDeck: (isPlayer: boolean, handCardPosition: number) =>
    set((state) => {
      const hand = isPlayer ? state.playerHand : state.opponentHand;
      const deck = isPlayer ? [...state.playerDeck] : [...state.opponentDeck];
      const cardId = hand[handCardPosition];
      if (cardId === null) {
        console.warn(
          "trying to desicard a card that is already discard, user cardDeckToHand instead"
        );
        return {};
      }
      hand[handCardPosition] = null;
      deck.push(cardId);
      return isPlayer
        ? { playerHand: hand, playerDeck: deck }
        : { opponentHand: hand, opponentDeck: deck };
    }),

  shuffleDeck: (isPlayer: boolean) =>
    set((state) =>
      setNewDeck(isPlayer, _.shuffle([...getDeckFromState(isPlayer, state)]))
    ),

  removeEffect: (
    isPlayerCard: boolean,
    cardPosition: number,
    effectToRemove: keyof CardEffects["effects"]
  ) => {
    set(
      updateCard(
        isPlayerCard,
        cardPosition,
        (card) => {
          card.effects[effectToRemove] = undefined;
          return card;
        },
        "Can't remove effect, card doest not exist"
      )
    );
  },
}));

export default useGameStore;

function updateCard(
  isPlayerCard: boolean,
  cardPosition: number,
  transformCard: (card: InGameCardType) => InGameCardType | null,
  notFoundMessage?: string
) {
  return (state: GameStore) => {
    const board = getBoardFromState(isPlayerCard, state);
    const card = board[cardPosition];
    if (card === null) {
      notFoundMessage && console.warn(notFoundMessage);
      return {};
    }
    board[cardPosition] = transformCard(card);
    return setNewBoard(isPlayerCard, board);
  };
}
function getBoardFromState(isPlayer: boolean, state: GameStore) {
  return isPlayer ? [...state.playerBoard] : [...state.opponentBoard];
}
function setNewBoard(isPlayer: boolean, board: (InGameCardType | null)[]) {
  return isPlayer ? { playerBoard: board } : { opponentBoard: board };
}

function getDeckFromState(isPlayer: boolean, state: GameStore) {
  return isPlayer ? [...state.playerDeck] : [...state.opponentDeck];
}
function setNewDeck(isPlayer: boolean, deck: number[]) {
  return isPlayer ? { playerDeck: deck } : { opponentDeck: deck };
}

export function getHandFromState(isPlayer: boolean, state: GameStore) {
  return isPlayer ? [...state.playerHand] : [...state.opponentHand];
}
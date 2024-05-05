import { create } from 'zustand'

interface GameStore {
  playerHand: number[];
  playerMana: number;
  playerHp: number;
  playerMaxHp: number;
  playerTimestampStartEarningMana: null | number;

  opponentMana: number;
  opponentHp: number;
  opponentMaxHp: number;
  opponentTimestampStartEarningMana: null | number;

  playerBoard: (InGameCard | null)[];
  opponentBoard: (InGameCard | null)[];

  startEarningMana: (isPlayer: boolean) => void;
  increaseMana: (isPlayer: boolean) => void;
  consumeMana: (isPlayer: boolean, amount: number) => void;
  getData: () => GameStore;
  getBoardCurrentCard: (isPlayer: boolean, position: number) => InGameCard | null;
  placeCardBoard: (isPlayer: boolean, position: number, card: InGameCard) => void;
}

export interface InGameCard {
  id: number;
  maxHp: number;
  hp: number;
  dmg: number;
  attackSpeed: number; 
}

const useGameStore = create<GameStore>()((set, get) => ({
  playerHand: [1,2,3,4],
  playerMana: 8,
  playerHp: 5000,
  playerMaxHp: 5000,
  playerTimestampStartEarningMana: null,

  playerBoard: [null, null, null, null],
  
  opponentMana: 0,
  opponentHp: 0,
  opponentMaxHp: 0,
  opponentTimestampStartEarningMana: null,
  
  opponentBoard: [null, null, null, null],

  getData: () => get(),
  startEarningMana: (isPlayer: boolean) => set(
    isPlayer
      ? { playerTimestampStartEarningMana: new Date().getTime() }
      : { opponentTimestampStartEarningMana: new Date().getTime() }
  ),
  increaseMana: (isPlayer: boolean) => set(
    state => isPlayer
      ? { playerMana: state.playerMana + 1, playerTimestampStartEarningMana: null }
      : { opponentMana: state.opponentMana + 1, opponentTimestampStartEarningMana: null }
  ),
  consumeMana: (isPlayer: boolean, amount: number) => set(
    state => isPlayer ? { playerMana: state.playerMana - amount } : { opponentMana: state.opponentMana - amount }
  ),
  // board
  getBoardCurrentCard: (isPlayer: boolean, position: number) => (
    isPlayer ? get().playerBoard[position] : get().opponentBoard[position]
  ),
  placeCardBoard: (isPlayer: boolean, position: number, card: InGameCard) => {
    if (isPlayer) {
      const newBoard = [...get().playerBoard];
      newBoard[position] = card;
      set({ playerBoard: newBoard })
    } else {
      const newBoard = [...get().opponentBoard];
      newBoard[position] = card;
      set({ opponentBoard: newBoard })
    }
  },
}));

export default useGameStore;
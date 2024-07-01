import { InGameCardType } from "@/game/stores/gameStateStore";
import { CardEffects } from "@repo/types";
import { CardType } from "@repo/ui";

interface GameStateObjectConstructor {
	playerDeck: CardType[];
	opponentDeck: CardType[];
	playerHp: number;
	opponentHp: number;
}

export type CurrentWinner = "player" | "opponent" | null;

export class GameStateObject {
	constructor({ playerDeck, opponentDeck, playerHp, opponentHp }: GameStateObjectConstructor) {
		this.playerMana = 0;
		this.opponentMana = 0;
		this.playerTickStartEarningMana = null;
		this.opponentTickStartEarningMana = null;
		this.playerHand = [null, null, null, null];
		this.opponentHand = [null, null, null, null];
		this.playerDeck = [...playerDeck];
		this.opponentDeck = [...opponentDeck];
		this.playerBoard = [null, null, null];
		this.opponentBoard = [null, null, null];
		this.currentInstanceId = 0;
		this.playerHp = playerHp;
		this.opponentHp = opponentHp;
		this.currentWinner = null;
		this.playerMaxHp = playerHp;
		this.opponentMaxHp = opponentHp;
		this.currentWinner = null;
	}

	// state (nested properties are forbidden)
	playerMana: number;
	playerTickStartEarningMana: number | null;
	opponentMana: number;
	opponentTickStartEarningMana: number | null;
	playerHand: (CardType | null)[];
	opponentHand: (CardType | null)[];
	playerDeck: CardType[] = [];
	opponentDeck: CardType[] = [];
	playerBoard: (InGameCardType | null)[];
	opponentBoard: (InGameCardType | null)[];
	playerHp: number;
	opponentHp: number;
	playerMaxHp: number;
	opponentMaxHp: number;

	currentInstanceId: number;
	currentWinner: CurrentWinner;

	// methods
	startEarningMana(isPlayer: boolean, tick: number) {
		if (isPlayer) {
			this.playerTickStartEarningMana = tick;
		} else {
			this.opponentTickStartEarningMana = tick;
		}
	}
	increaseMana(isPlayer: boolean) {
		if (isPlayer) {
			this.playerMana = this.playerMana + 1;
			this.playerTickStartEarningMana = null;
		} else {
			this.opponentMana = this.opponentMana + 1;
			this.opponentTickStartEarningMana = null;
		}
	}
	consumeMana(isPlayer: boolean, amount: number) {
		if (isPlayer) {
			this.playerMana = this.playerMana - amount;
		} else {
			this.opponentMana = this.opponentMana - amount;
		}
	}
	getHandFromState(isPlayer: boolean) {
		return isPlayer ? [...this.playerHand] : [...this.opponentHand];
	}
	// draw
	cardDeckToHand(isPlayer: boolean, targetPosition: number) {
		const hand = isPlayer ? this.playerHand : this.opponentHand;
		let deck = isPlayer ? [...this.playerDeck] : [...this.opponentDeck];
		if (hand[targetPosition] !== null) {
			console.warn(
				"trying to draw a card on a position where a card already exist, use cardHandToDeck instead"
			);
			return {};
		}
		hand[targetPosition] = deck[0];
		deck = deck.slice(1);
		if (isPlayer) {
			this.playerHand = hand;
			this.playerDeck = deck;
		} else {
			this.opponentHand = hand;
			this.opponentDeck = deck;
		}
	}
	cardHandToDeck(isPlayer: boolean, handCardPosition: number) {
		const hand = isPlayer ? this.playerHand : this.opponentHand;
		const deck = isPlayer ? [...this.playerDeck] : [...this.opponentDeck];
		const cardId = hand[handCardPosition];
		if (cardId === null) {
			console.warn(
				"trying to discard a card that is already discard, use cardDeckToHand instead"
			);
			return {};
		}
		hand[handCardPosition] = null;
		deck.push(cardId);
		if (isPlayer) {
			this.playerHand = hand;
			this.playerDeck = deck;
		} else {
			this.opponentHand = hand;
			this.opponentDeck = deck;
		}
	}
	// place card
	getNextInstanceId() {
		const nextId = this.currentInstanceId + 1;
		this.currentInstanceId = nextId;
		return nextId;
	}
	placeCardBoard(
		isPlayer: boolean,
		position: number,
		card: InGameCardType
	) {
		if (isPlayer) {
			const newBoard = [...this.playerBoard];
			newBoard[position] = card;
			this.playerBoard = newBoard;
		} else {
			const newBoard = [...this.opponentBoard];
			newBoard[position] = card;
			this.opponentBoard = newBoard;
		}
	}
	// attack
	startAttacking(isPlayer: boolean, cardPosition: number, tick: number) {
		const board = isPlayer ? this.playerBoard : this.opponentBoard;
		const card = board[cardPosition];
		if (!card) {
			console.warn("Card doesnt exist");
			return {};
		}
		card.startAttackingTick = tick;
		return isPlayer ? { playerBoard: board } : { opponentBoard: board };
	}
	// hp
	dealDamageToPlayer(isPlayer: boolean, damage: number) {
		if (isPlayer) {
			this.playerHp = this.playerHp - damage;
		} else {
			this.opponentHp = this.opponentHp - damage;
		}
	}
	// cards dmg
	dealDamageToCard(
    isPlayerCard: boolean,
    damage: number,
    cardPosition: number
  ) {
		const deck = isPlayerCard ? this.playerBoard : this.opponentBoard;
		const card = deck[cardPosition];
		if (!card) { // this is a common case, the card can be already destroyed
			return false;
		}
		card.hp = Math.max(0, card.hp - damage);
		return card.hp === 0;
  }
	destroyCard(isPlayerCard: boolean, cardPosition: number) {
		const board = isPlayerCard ? this.playerBoard : this.opponentBoard;
		board[cardPosition] = null;
  }
	healCard(isPlayerCard: boolean, cardPosition: number, amount: number) {
		const deck = isPlayerCard ? this.playerBoard : this.opponentBoard;
		const card = deck[cardPosition];
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		card.hp = Math.min(card.maxHp, card.hp + amount);
  }
	removeEffect(
    isPlayerCard: boolean,
    cardPosition: number,
    effectToRemove: keyof CardEffects
  ) {
		const deck = isPlayerCard ? this.playerBoard : this.opponentBoard;
		const card = deck[cardPosition];
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		card.effects[effectToRemove] = undefined;
  }

	setGameOver(winnerIsPlayer: boolean) {
		this.currentWinner = winnerIsPlayer ? "player" : "opponent";
	}
}
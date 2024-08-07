import { CardType } from "../../types/Card";
import { InGameCardType } from "../../types/eventType";
import { CardState } from "../states/CardStatesData";

export interface GameStateObjectConstructor {
	playerDeck: CardType[];
	opponentDeck: CardType[];
	playerHp: number;
	opponentHp: number;
}

export type CurrentWinner = "player" | "opponent" | "draw" | null;

export const defaultManaSpeed = 300;

export const MAX_MANA = 9;

export const MAX_GAME_DURATION = 300;

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
		this.playerManaSpeed = defaultManaSpeed;
		this.opponentManaSpeed = defaultManaSpeed;
		this.isStarted = false;
		this.timer = MAX_GAME_DURATION;
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
	playerManaSpeed: number;
	opponentManaSpeed: number;
	timer: number;

	currentInstanceId: number;
	currentWinner: CurrentWinner;

	isStarted: boolean;

	// methods
	startGame() {
		this.isStarted = true;
	}
	startEarningMana(isPlayer: boolean, tick: number) {
		if (isPlayer) {
			this.playerTickStartEarningMana = tick;
		} else {
			this.opponentTickStartEarningMana = tick;
		}
	}
	resetEarningMana(isPlayer: boolean) {
		if (isPlayer) {
			this.playerTickStartEarningMana = null;
		} else {
			this.opponentTickStartEarningMana = null;
		}
	}
	setIncreaseManaSpeed(isPlayer: boolean, speed: number) {
		if (isPlayer) {
			this.playerManaSpeed = speed;
		} else {
			this.opponentManaSpeed = speed;
		}
	}
	increaseMana(isPlayer: boolean, value: number) {
		if (isPlayer) {
			this.playerMana = Math.min(this.playerMana + value, MAX_MANA);
		} else {
			this.opponentMana = Math.min(this.opponentMana + value, MAX_MANA);
		}
	}
	consumeMana(isPlayer: boolean, amount: number) {
		if (isPlayer) {
			this.playerMana = Math.max(this.playerMana - amount, 0);
		} else {
			this.opponentMana = Math.max(this.opponentMana - amount, 0);
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
		const card = this.getCard(isPlayerCard, cardPosition);
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

	setGameOver(winner: CurrentWinner) {
		this.currentWinner = winner;
	}

	decreaseTimer() {
		this.timer--;
		return this.timer;
	}

	// events
	removeState(
		instanceId: number,
		type: CardState["type"],
	) {
		const card = this.getCardInstance(instanceId);
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		card.states = card.states.filter((s) => s.type !== type);
	}
	addState(
		instanceId: number,
		state: CardState,
	) {
		const card = this.getCardInstance(instanceId);
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		card.states.push({ ...state });
	}
	modifyStateValue(
		instanceId: number,
		stateType: CardState["type"],
		delta: number,
	) {
		const card = this.getCardInstance(instanceId);
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		const stateIndex = card.states.findIndex((s) => s.type === stateType);
		if (stateIndex === -1) {
			return;
		}
		const value = card.states[stateIndex].value;
		if (value === null) {
			return;
		}
		const nextState = { ...card.states[stateIndex], value: value + delta } as CardState;
		card.states[stateIndex] = nextState; // we mutate the state
	}
	shuffleDeck(isPlayer: boolean) {
		if (isPlayer) {
			this.playerDeck = this.playerDeck.sort(() => Math.random() - 0.5);
		} else {
			this.opponentDeck = this.opponentDeck.sort(() => Math.random() - 0.5);
		}
	}
	// utils
	getCard(isPlayerCard: boolean, cardPosition: number) {
		return (isPlayerCard ? this.playerBoard : this.opponentBoard)[cardPosition];
	}
	getCardInstance(instanceId: number) {
		return [...this.playerBoard, ...this.opponentBoard].find((c) => c?.instanceId === instanceId) || null;
	}
	getBoard(isPlayer: boolean) {
		return isPlayer ? this.playerBoard : this.opponentBoard;
	}
	getStateOfCard(isPlayerCard: boolean, cardPosition: number, type: CardState["type"]) {
		const card = this.getCard(isPlayerCard, cardPosition);
		if (!card) {
			return null;
		}
		return card.states.find((s) => s.type === type);
	}
	getStateOfCardWithIndex(isPlayerCard: boolean, cardPosition: number, type: CardState["type"]): null | [number, CardState] {
		const card = this.getCard(isPlayerCard, cardPosition);
		if (!card) {
			return null;
		}
		const index = card.states.findIndex((s) => s.type === type);
		return index === -1 ? null : [index, card.states[index]];
	}
	getStateOfCardByInstanceId(instanceId: number, type: CardState["type"]) {
		const card = this.getCardInstance(instanceId);
		if (!card) {
			return null;
		}
		return card.states.find((s) => s.type === type) ?? null;
	}
	getMana(isPlayer: boolean) {
		return isPlayer ? this.playerMana : this.opponentMana;
	}
	getStartEarningMana(isPlayer: boolean) {
		return isPlayer ? this.playerTickStartEarningMana : this.opponentTickStartEarningMana;
	}
	getManaSpeed(isPlayer: boolean) {
		return isPlayer ? this.playerManaSpeed : this.opponentManaSpeed;
	}
	getCurrentWinner() {
		return this.currentWinner;
	}
	getTimer() {
		return this.timer;
	}
}
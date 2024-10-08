import { filterNulls } from "@repo/lib";
import { CardType } from "../../types/Card";
import { InGameCardType } from "../../types/eventType";
import { CardState } from "../states/CardStatesData";
import { getFrameFromAttackSpeed } from "./events/utils";
import { cloneDeep } from "lodash";

export interface GameStateObjectConstructor {
	playerDeck: CardType[];
	opponentDeck: CardType[];
	playerHp: number;
	opponentHp: number;
}

export interface DecayingState {
	startFrame: number;
	endFrame: number;
	stateType: CardState["type"];
	instanceId: number;
}

export type CurrentWinner = "player" | "opponent" | "draw" | null;

export const defaultManaSpeed = 300;

export const MAX_MANA = 9;

export const MAX_GAME_DURATION = 300;

export const MAX_ATTACK_SPEED = 3;

export const MAX_COST_CARD = 9;

export const CARD_IN_HAND = 4;

export const MIN_COST_CARD = 1;

export const MIN_ATTACK_SPEED = 0.01;

export const HAND_SIZE = 4;

export const BOARD_SIZE = 3;

export class GameStateObject {
	constructor({ playerDeck, opponentDeck, playerHp, opponentHp }: GameStateObjectConstructor) {
		this.currentInstanceId = 0;

		this.playerMana = 0;
		this.opponentMana = 0;
		this.playerTickStartEarningMana = null;
		this.opponentTickStartEarningMana = null;
		this.playerHand = Array(HAND_SIZE).fill(null);
		this.opponentHand = Array(HAND_SIZE).fill(null);
		this.playerDeck = cloneDeep(playerDeck).map((c) => ({ ...c, id: this.getNextInstanceId() }));
		this.opponentDeck = cloneDeep(opponentDeck).map((c) => ({ ...c, id: this.getNextInstanceId() }));
		this.playerBoard = Array(BOARD_SIZE).fill(null);
		this.opponentBoard = Array(BOARD_SIZE).fill(null);
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
		this.trackedStateDecaying = [];
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

	trackedStateDecaying: DecayingState[];

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
	startAttacking(instanceId: number, startTick: number) {
		const card = this.getCardByInstance(instanceId);
		if (!card) {
			console.warn("Card doesnt exist");
			return null;
		}
		card.startAttackingTick = startTick;
		card.endAttackingTick = startTick + getFrameFromAttackSpeed(card.attackSpeed);
		return card.endAttackingTick - card.startAttackingTick
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
		instanceId: number,
		damage: number,
	) {
		const card = this.getCardByInstance(instanceId);
		if (!card) { // this is a common case, the card can be already destroyed
			return false;
		}
		card.hp = Math.max(0, card.hp - damage);
		return card.hp === 0;
	}
	destroyCard(instanceId: number) {
		const playerCard = this.playerBoard.findIndex((c) => c?.instanceId === instanceId);
		const opponentCard = this.opponentBoard.findIndex((c) => c?.instanceId === instanceId);
		if (playerCard !== -1) {
			this.playerBoard[playerCard] = null;
		} else if (opponentCard !== -1) {
			this.opponentBoard[opponentCard] = null;
		}
	}
	healCard(instanceId: number, amount: number) {
		const card = this.getCardByInstance(instanceId);
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
		const card = this.getCardByInstance(instanceId);
		if (!card) { // this is a common case, the card can be already destroyed
			return;
		}
		card.states = card.states.filter((s) => s.type !== type);
	}
	removeDeckCardState(instanceId: number, type: CardState["type"]) {
		const card = this.getDeckCardByInstanceId(instanceId);
		if (!card) {
			return;
		}
		card.states = card.states.filter((s) => s.type !== type);
	}
	addState(
		instanceId: number,
		state: CardState,
	) {
		const card = this.getCardByInstance(instanceId);
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
		const card = this.getCardByInstance(instanceId);
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
	modifyDeckCardStateValue(
		instanceId: number,
		stateType: CardState["type"],
		delta: number,
	) {
		const state = this.getStateOfDeckCard(instanceId, stateType);
		if (!state || state.value === null) {
			return;
		}
		state.value = state.value + delta;
	}
	discardHand(isPlayer: boolean) {
		if (isPlayer) {
			this.playerDeck = filterNulls([...this.playerDeck, ...this.playerHand]);
			this.playerHand = Array(HAND_SIZE).fill(null);
		} else {
			this.opponentDeck = filterNulls([...this.opponentDeck, ...this.opponentHand]);
			this.opponentHand = Array(HAND_SIZE).fill(null);
		}
	}
	shuffleDeck(isPlayer: boolean) {
		if (isPlayer) {
			this.playerDeck = this.playerDeck.sort(() => Math.random() - 0.5);
		} else {
			this.opponentDeck = this.opponentDeck.sort(() => Math.random() - 0.5);
		}
	}
	increaseAttackSpeed(instanceId: number, increasePercent: number) {
		const card = this.getCardByInstance(instanceId);
		if (!card) {
			return;
		}
		const previousAttackSpeed = card.attackSpeed;
		card.modifierOfAttackSpeedPercentage = card.modifierOfAttackSpeedPercentage + increasePercent;
		card.attackSpeed = Math.min(MAX_ATTACK_SPEED, Math.max(MIN_ATTACK_SPEED, card.initialAttackSpeed * (1 + card.modifierOfAttackSpeedPercentage / 100)));
		return previousAttackSpeed;
	}
	startAttackAnimation(instanceId: number, target: number) {
		this.mutateCard(instanceId, card => {
			if (!card.endAttackingTick) {
				return;
			}
			card.startAttackingAnimationTick = target;
		});
	}
	endAttackAnimation(instanceId: number) {
		this.mutateCard(instanceId, card => {
			card.startAttackingAnimationTick = null;
		});
	}
	addStateDecayTimeout(instanceId: number, stateType: CardState["type"], startFrame: number, duration: number) {
		this.trackedStateDecaying.push({
			startFrame,
			endFrame: startFrame + duration,
			stateType,
			instanceId,
		});
	}
	getStateDecayTimeout(instanceId: number, stateType: CardState["type"]) {
		return this.trackedStateDecaying.find((t) => t.instanceId === instanceId && t.stateType === stateType) || null;
	}
	removeStateDecayTimeout(instanceId: number, stateType: CardState["type"]) {
		this.trackedStateDecaying = this.trackedStateDecaying.filter((t) => t.instanceId !== instanceId || t.stateType !== stateType);
	}
	// utils
	updateDeckCard(instanceId: number, mutator: (card: CardType) => void) {
		const card = this.getDeckCardByInstanceId(instanceId);
		if (!card) {
			return;
		}
		mutator(card);		
	}
	mutateCard(instanceId: number, mutator: (card: InGameCardType) => void) {
		const card = this.getCardByInstance(instanceId);
		if (!card) {
			return;
		}
		mutator(card);
	}
	getCard(isPlayerCard: boolean, cardPosition: number) {
		return (isPlayerCard ? this.playerBoard : this.opponentBoard)[cardPosition];
	}
	getCardByInstance(instanceId: number) {
		return [...this.playerBoard, ...this.opponentBoard].find((c) => c?.instanceId === instanceId) || null;
	}
	getCardInfo(instanceId: number) {
		const playerCard = this.playerBoard.findIndex((c) => c?.instanceId === instanceId);
		const opponentCard = this.opponentBoard.findIndex((c) => c?.instanceId === instanceId);
		if (playerCard !== -1) {
			return { isPlayerCard: true, position: playerCard, card: this.playerBoard[playerCard]! };
		} else if (opponentCard !== -1) {
			return { isPlayerCard: false, position: opponentCard, card: this.opponentBoard[opponentCard]! };
		}
		return null;
	}
	getCardPosition(instanceId: number) {
		const playerCard = this.playerBoard.findIndex((c) => c?.instanceId === instanceId);
		const opponentCard = this.opponentBoard.findIndex((c) => c?.instanceId === instanceId);
		if (playerCard !== -1) {
			return { isPlayerCard: true, position: playerCard };
		} else if (opponentCard !== -1) {
			return { isPlayerCard: false, position: opponentCard };
		}
		return null
	}
	getIsPlayerCard(instanceId: number) {
		return this.playerBoard.findIndex((c) => c?.instanceId === instanceId) !== -1;
	}
	getOppositeCard(instanceId: number) {
		const playerCard = this.playerBoard.findIndex((c) => c?.instanceId === instanceId);
		const opponentCard = this.opponentBoard.findIndex((c) => c?.instanceId === instanceId);
		if (playerCard !== -1) {
			return this.opponentBoard[playerCard];
		} else if (opponentCard !== -1) {
			return this.playerBoard[opponentCard];
		}
		return null;
	}
	getBoard(isPlayer: boolean) {
		return isPlayer ? this.playerBoard : this.opponentBoard;
	}
	getHand(isPlayer: boolean) {
		return isPlayer ? this.playerHand : this.opponentHand;
	}
	getBoardOfCard(instanceId: number, opposite: boolean = false) {
		const playerCard = this.playerBoard.findIndex((c) => c?.instanceId === instanceId);
		const opponentCard = this.opponentBoard.findIndex((c) => c?.instanceId === instanceId);
		if (playerCard !== -1) {
			return this.getBoard(true && !opposite);
		} else if (opponentCard !== -1) {
			return this.getBoard(false || opposite);
		}
		return null;
	}
	getStateOfCard(isPlayerCard: boolean, cardPosition: number, type: CardState["type"]) {
		const card = this.getCard(isPlayerCard, cardPosition);
		if (!card) {
			return null;
		}
		return card.states.find((s) => s.type === type);
	}
	getStateOfDeckCard(instanceId: number, type: CardState["type"]) {
		const card = this.getDeckCardByInstanceId(instanceId);
		if (!card) {
			return null;
		}
		return this.extratStateOfCard(card, type);
	}
	extratStateOfCard(card: { states: CardState[] }, type: CardState["type"]) {
		return card.states.find((s) => s.type === type);
	}
	getStateOfCardWithIndex(isPlayerCard: boolean, cardPosition: number, type: CardState["type"]): null | [number, CardState] {
		const card = this.getCard(isPlayerCard, cardPosition);
		if (!card) {
			return null;
		}
		return this.getStateOfCardWithIndexByCard(card, type);
	}
	getStateOfDeckCardWithIndex(isPlayerCard: boolean, cardPosition: number, type: CardState["type"]): null | [number, CardState] {
		const card = this.getHand(isPlayerCard)[cardPosition];
		if (!card) {
			return null;
		}
		return this.getStateOfCardWithIndexByCard(card, type);
	}
	getStateOfCardWithIndexByCard(card: { states: CardState[] }, type: CardState["type"]): null | [number, CardState] {
		const index = card.states.findIndex((s) => s.type === type);
		return index === -1 ? null : [index, card.states[index]];
	}
	getStateOfCardByInstanceId(instanceId: number, type: CardState["type"]) {
		const card = this.getCardByInstance(instanceId);
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
	getCardTypeById(id: number) {
		return [...this.playerDeck, ...this.playerHand].find((c) => c && c.id === id);
	}
	getDeckCardByInstanceId(instanceId: number) {
		return [...this.playerDeck, ...this.opponentDeck, ...this.playerHand, ...this.opponentHand].find((c) => c?.id === instanceId) ?? null;
	}
	getStateOfDeckCardByInstaceId(instanceId: number, type: CardState["type"]) {
		const card = this.getDeckCardByInstanceId(instanceId);
		if (!card) {
			return null;
		}
		return card.states.find((s) => s.type === type) ?? null;
	}
	getPositionInHand(instanceId: number, isPlayer: boolean) {
		const hand = isPlayer ? this.playerHand : this.opponentHand;
		return hand.findIndex((c) => c?.id === instanceId);
	}
	getDeck(isPlayer: boolean) {
		return isPlayer ? this.playerDeck : this.opponentDeck;
	}
	getHandCardInstanceId(position: number, isPlayer: boolean) {
		return (isPlayer ? this.playerHand : this.opponentHand)[position]?.id;
	}
}
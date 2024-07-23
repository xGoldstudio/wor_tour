import { CardAttackingEvent, CardDamagResolveEvent, CardDamageEvent, CardDestroyedEvent, CardStartAttackingEvent, DrawCardEvent, EventType, GameOverEvent, HealCardEvent, ManaConsumeEvent, ManaIncreaseEvent, PlaceCardEvent, PlayerDamageEvent, PlayerDamageResolveEvent, StartEarningMana, SetManaIncreaseSpeed, StartGameSequence, StartGame, RemoveStateEvent, TriggerStateEvent, AddStateEvent, IncreaseStateValueEvent, DecreaseStateValueEvent } from '../../types/eventType';
import startEarningManaEvent from "./events/startEarningMana";
import manaIncreaseEvent from './events/manaIncrease';
import { GameStateObject } from './gameState';
import { ClockReturn } from '../clock/clock';
import manaConsumeEvent from './events/manaConsume';
import drawCardEvent from './events/drawCard';
import placeCardEvent from './events/placeCard';
import cardStartAttackingEvent from './events/cardStartAttacking';
import cardAttackingEvent from './events/cardAttacking';
import playerDamageEvent from './events/playerDamage';
import playerDamageResolveEvent from './events/playerDamageResolve';
import cardDamageEvent from './events/cardDamage';
import cardDamageResolveEvent from './events/cardDamageResolve';
import cardDestroyedEvent from './events/cardDestroyed';
import gameOverEvent from './events/gameOverEvent';
import healCardEvent from './events/healCard';
import removeStateEvent from './events/removeState';
import addStateEvent from './events/addState';
import triggerStateEvent from './events/triggerState';
import setManaIncreaseSpeed from './events/setManaIncreaseSpeed';
import startGameSequence from './events/startGameSequence';
import startGame from './events/startGame';
import increaseStateValueEvent from './events/increaseStateValue';
import decreaseStateValueEvent from './events/decreaseStateValue';

export const FRAME_TIME = 10;

export interface ComputeEventProps<E extends EventType> {
	gameState: GameStateObject;
	event: E;
	clock: ClockReturn<EventType>;
}

type EventTypeMap = {
	startGameSequence: StartGameSequence;
	startGame: StartGame;
	manaIncrease: ManaIncreaseEvent;
	manaConsume: ManaConsumeEvent;
	setManaIncreaseSpeed: SetManaIncreaseSpeed;
	placeCard: PlaceCardEvent;
	startEarningMana: StartEarningMana;
	cardStartAttacking: CardStartAttackingEvent;
	cardAttacking: CardAttackingEvent;
	playerDamage: PlayerDamageEvent;
	cardDamage: CardDamageEvent;
	cardDestroyed: CardDestroyedEvent;
	gameOver: GameOverEvent;
	drawCard: DrawCardEvent;
	healCard: HealCardEvent;
	cardDamageResolve: CardDamagResolveEvent;
	playerDamageResolve: PlayerDamageResolveEvent;
	increaseStateValue: IncreaseStateValueEvent;
	decreaseStateValue: DecreaseStateValueEvent;
	removeState: RemoveStateEvent;
	triggerState: TriggerStateEvent;
	addState: AddStateEvent;
};

type EventHandlers = {
	[K in keyof EventTypeMap]: (props: ComputeEventProps<EventTypeMap[K]>) => void;
};

const EventsCompute: EventHandlers = {
	startGameSequence: startGameSequence,
	startGame: startGame,
	manaIncrease: manaIncreaseEvent,
	startEarningMana: startEarningManaEvent,
	setManaIncreaseSpeed: setManaIncreaseSpeed,
	manaConsume: manaConsumeEvent,
	drawCard: drawCardEvent,
	placeCard: placeCardEvent,
	cardStartAttacking: cardStartAttackingEvent,
	cardAttacking: cardAttackingEvent,
	playerDamage: playerDamageEvent,
	playerDamageResolve: playerDamageResolveEvent,
	cardDamage: cardDamageEvent,
	cardDamageResolve: cardDamageResolveEvent,
	cardDestroyed: cardDestroyedEvent,
	healCard: healCardEvent,
	gameOver: gameOverEvent,
	removeState: removeStateEvent,
	addState: addStateEvent,
	increaseStateValue: increaseStateValueEvent,
	decreaseStateValue: decreaseStateValueEvent,
	triggerState: triggerStateEvent,
}

// used in front and back and can be debugged easily (not pure mutate the state)
export function computeNextFrameState(
	gameState: GameStateObject,
	event: EventType,
	clock: ClockReturn<EventType>,
): GameStateObject {
	// once the game is over, we don't compute any more events
	if (gameState.currentWinner !== null) {
		return gameState;
	}
	// @ts-expect-error its fine
	EventsCompute[event.type]({ event, gameState, clock });
	return gameState;
}

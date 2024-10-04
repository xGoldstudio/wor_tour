import { GameStateObject } from "../../gameEngine/gameState";
import { ClockReturn } from "../../clock/clock";
import { EventType } from "../../../types/eventType";
import { AddedStateAction, ChangeValueStateAction } from "../CardStatesData";

const onChangeValueScorch: ChangeValueStateAction = ({ clock, event, gameState }) => {
	if (event.delta <= 0) {
		return;
	}
	const burnStack = gameState.getStateOfCardByInstanceId(event.instanceId, "scorch");
	if (typeof(burnStack?.value) !== "number") {
		return;
	}
	scorchDamage(gameState, clock, event.instanceId, burnStack.value);
}

const onAddedScorch: AddedStateAction = ({ clock, event, gameState }) => {
	scorchDamage(gameState, clock, event.instanceId, event.state.value!);
}

function scorchDamage(
	gameState: GameStateObject,
	clock: ClockReturn<EventType>,
	instanceId: number,
	burnStack: number,
) {
	const card = gameState.getCardByInstance(instanceId);
	if (!card ) {
		return;
	}
	clock.triggerEvent({
		type: "beforeCardDamageResolve",
		initiator: {
			type: "cardDamage",
			instanceId: instanceId,
			directAttack: false,
			amount: burnStack,
			onDirectHitStates: [],
			cardInitiator: card,
			initiator: {
				type: "cardAttacking",
				instanceId: instanceId,
				cardIniator: card,
			},
		}
	})
}

export {
	onAddedScorch,
	onChangeValueScorch,
};
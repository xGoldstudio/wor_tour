import { AttackModifierStateAction, filterUndefined, getOptionsFromType } from "@repo/lib";
import { BeforeCardDamageResolveEvent, InGameCardType } from "../../../types/eventType";
import { ComputeEventProps } from "../gameEngine";

// this event is required to have state effectively added to the card  
export default function beforeCardDamageResolve({ event, gameState, clock }: ComputeEventProps<BeforeCardDamageResolveEvent>) {
	const card = gameState.getCardByInstance(event.initiator.instanceId);
	if (!card) { // should never happen
		return;
	}
	const damageModifiers = getDamageModifiers(card).map((modifierFn) => modifierFn({ gameState, clock, event}));
	const damage = Math.floor(damageModifiers.reduce((acc, modifier) => acc * modifier, event.initiator.amount));
	clock.triggerEvent({
		type: "cardDamageResolve",
		initiator: event.initiator,
		damage,
	});
}

function getDamageModifiers(card: InGameCardType): AttackModifierStateAction[] {
	return filterUndefined(card.states
		.map((state) => getOptionsFromType(state.type).onDamageModifier))
}
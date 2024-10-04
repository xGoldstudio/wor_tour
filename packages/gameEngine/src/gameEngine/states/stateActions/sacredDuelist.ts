import { AttackModifierStateAction } from "../CardStatesData";

const sacredDuelistOnDamageModifier: AttackModifierStateAction = ({ event }) => {
	return event.initiator.directAttack ? 1 : 0;
}

export {
	sacredDuelistOnDamageModifier,
};
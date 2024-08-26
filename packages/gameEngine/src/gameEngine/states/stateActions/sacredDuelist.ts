import { AttackModifierStateAction } from "@repo/lib";

const sacredDuelistOnDamageModifier: AttackModifierStateAction = ({ event }) => {
	return event.initiator.directAttack ? 1 : 0;
}

export {
	sacredDuelistOnDamageModifier,
};
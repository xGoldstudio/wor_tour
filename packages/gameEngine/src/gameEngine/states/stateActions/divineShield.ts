import { AttackModifierStateAction } from "@repo/lib";

const divineShieldOnDamageModifier: AttackModifierStateAction = ({ event }) => {
	return event.initiator.directAttack ? 0 : 1;
}

export {
	divineShieldOnDamageModifier,
};
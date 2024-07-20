import { FRAME_TIME } from "../gameEngine";

export const getFrameFromAttackSpeed = (attackSpeed: number) => {
	return 1000 / attackSpeed / FRAME_TIME;
}
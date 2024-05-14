import { AttackAnimation } from "@/stores/gameStateInterface";

export default function GameCanvas() {
	const canvas = document.createElement('canvas');
	canvas.style.position = "absolute";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.pointerEvents = "none";
	canvas.id = "gameCanvas";
	const ctx = canvas.getContext("2d");

	let animations: AttackAnimation[] = [];

	function append(target: HTMLDivElement) {
		target.appendChild(canvas);
	}

	function paint(tick: number) {
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let i = 0;
		while (i < animations.length && animations[i].onTick + 20 === tick) {
			i++;
		}
		animations = animations.slice(i);
		animations.forEach((animation) => {
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillRect(
				animation.from.x - 10,
				animation.from.y,
				20,
				animation.to.y - animation.from.y,
			);
		});
	}

	function newAnimations(newAnimations: AttackAnimation[]) {
		if (newAnimations.length === 0) {
			return;
		}
		animations = [...animations, ...newAnimations];
	}

	return {
		append,
		paint,
		newAnimations,
	};
}
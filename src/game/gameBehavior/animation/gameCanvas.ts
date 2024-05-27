import { Point } from "@/game/TargetLine";
import { Animation3dType } from "@/game/stores/gameStateStore";
import * as THREE from 'three';
import { cubicBezier } from "./timeline";

const ATTACK_ANIMATION_TIMING = 20;

export interface GameCanvasReturn {
	append: (target: HTMLDivElement) => void;
	paint: (tick: number) => void;
	newAnimation: (originId: string, targetId: string, type: Animation3dType, onTick: number, options?: GameCanvasAnimationOptions) => void;
	destroy: () => void;
}

interface GameCanvasAnimationOptions {
	onAnimationEnd?: () => void;
	sameX?: boolean;
}

export default function GameCanvas(): GameCanvasReturn {
	const canvas = document.createElement('canvas');
	canvas.style.position = "absolute";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.pointerEvents = "none";
	canvas.id = "gameCanvas";
	canvas.style.zIndex = "100";
	const instance = setupScene(canvas);
	let appended = false;

	let animations: AnimationInstance[] = [];

	function append(target: HTMLDivElement) {
		if (appended) {
			return;
		}
		target.appendChild(canvas);
		instance.render();
		appended = true;
	}

	function paint(tick: number) {
		if (animations.length === 0) {
			return;
		}
		animations.forEach((instance, index) => {
			if (!instance.setProgress(tick)) {
				instance.remove();
				animations.splice(index, 1);
			}
		});
		instance.render();
	}

	function newAnimation(originId: string, targetId: string, type: Animation3dType, onTick: number, options?: GameCanvasAnimationOptions) {
		const origin = document.getElementById(originId)?.getBoundingClientRect();
		const target = document.getElementById(targetId)?.getBoundingClientRect();
		if (!origin || !target) {
			return;
		}
		const fromPoint = instance.raycast(new THREE.Vector2(
			origin.left + origin.width / 2 + window.pageXOffset,
			origin.top + origin.height / 2 + window.pageYOffset,
		));
		const toPoint = instance.raycast(new THREE.Vector2(
			target.left + target.width / 2 + window.pageXOffset,
			target.top + target.height / 2 + window.pageYOffset,
		));
		const animationInstance = instance.initAnimation(fromPoint, toPoint, type, onTick, options);
		animations = [...animations, animationInstance];
	}

	function destroy() {
		canvas.remove();
		instance.destroy();
		animations = [];
	}

	return {
		append,
		paint,
		newAnimation,
		destroy,
	};
}

interface AnimationInstance {
	setProgress: (progress: number) => boolean;
	remove: () => void;
}

function setupScene(canvas: HTMLCanvasElement) {
	// Scene
	const scene = new THREE.Scene();

	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight
	}

	// camera
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 10;
	scene.add(camera);

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: true,
	})
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	window.addEventListener('resize', () => {
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Update camera
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	})

	const textureLoader = new THREE.TextureLoader();
	const attackTexture = textureLoader.load('/textureAttack.png');
	const healTexture = textureLoader.load('/heal.png');
	attackTexture.colorSpace = THREE.SRGBColorSpace;
	healTexture.colorSpace = THREE.SRGBColorSpace;

	const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

	const transparentMat = new THREE.MeshMatcapMaterial({ transparent: true, depthTest: false, opacity: 0 })
	const planeGeometry = new THREE.PlaneGeometry(sizes.width, sizes.height);
	const plane = new THREE.Mesh(planeGeometry, transparentMat);
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0
	scene.add(plane)
	const raycaster = new THREE.Raycaster();

	function raycast(pointer: THREE.Vector2): Point {
		pointer.x = (pointer.x / window.innerWidth) * 2 - 1;
		pointer.y = - (pointer.y / window.innerHeight) * 2 + 1;
		let targetPoint = {
			x: 0, y: 0,
		}
		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children);

		for (let i = 0; i < intersects.length; i++) {
			if (intersects[i].object.uuid === plane.uuid) {
				targetPoint = {
					x: intersects[i].point.x,
					y: intersects[i].point.y,
				}
			}
		}
		return targetPoint;
	}

	const textures: Record<Animation3dType, THREE.Texture> = {
		attack: attackTexture,
		heal: healTexture,
	}

	function initAnimation(start: Point, end: Point, type: Animation3dType, onTick: number, options?: GameCanvasAnimationOptions): AnimationInstance {
		const texture = new THREE.MeshMatcapMaterial({ matcap: textures[type], transparent: true });
		const projectile = new THREE.Mesh(geometry, texture);
		projectile.position.x = start.x;
		projectile.position.y = start.y;
		projectile.position.z = 0;
		projectile.scale.set(0.03, 0.03, 0.03);
		scene.add(projectile);
		const diffX = -(start.x - end.x);
		const diffY = -(start.y - end.y);
		const staleTick = onTick + ATTACK_ANIMATION_TIMING;
		return {
			setProgress: (tick: number) => {
				if (tick > staleTick) {
					return false;
				}
				const animationTick = tick - onTick;
				const progress = cubicBezier(animationTick / ATTACK_ANIMATION_TIMING, 0, 0.6, 1, 1);
				projectile.position.x = options?.sameX ? start.x : (start.x + (progress * diffX));
				projectile.position.y = start.y + (progress * diffY);
				projectile.rotation.x = progress / 2 * Math.PI;
				projectile.rotation.z = progress * Math.PI;
				texture.opacity = 1 * (1 - ((Math.max(0, progress - 0.5) * 2)));
				return true;
			},
			remove: () => {
				projectile.removeFromParent();
				options?.onAnimationEnd?.();
			},
		};
	}

	return {
		render: () => {
			renderer.render(scene, camera)
		},
		raycast,
		initAnimation,
		destroy: () => {
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
}
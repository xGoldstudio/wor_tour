import { initTest } from "./common";

test("multi attack", () => {
	const { state, clock } = initTest();
	void state;
	void clock;
	clock.triggerEvent({ type: "drawCard", isPlayer: true, handPosition: 0 });
	clock.triggerEvent({ type: "placeCard", isPlayer: true, targetPosition: 0, cardInHandPosition: 0 });

	// case 1 normal attack

	// case 2 direct attack with ennemy not on same case

	// case 3 direct attack with ennemy on same case and no ennemy on the other case ( no direct damage )

	// case 4 direct attack with ennemy on same case and ennemy one other case

	// case 5 direct attack with ennemy on same case and ennemies on all other cases
});
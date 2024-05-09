import Clock from "./clock";

function triggerEvent(event: void) {
	return;
}

test('clock next tick', () => {
	const clock = Clock(triggerEvent);
  expect(clock.currentFrame).toBe(0);
	clock.nextTick();
	clock.nextTick();
	clock.nextTick();
  expect(clock.currentFrame).toBe(3);
});
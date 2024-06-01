import Clock from "./clock";

const mockTriggerEvent = jest.fn(() => null);

beforeEach(() => {
  mockTriggerEvent.mockReset();
});

test("clock next tick", () => {
  const clock = Clock(mockTriggerEvent);
  expect(clock.getImmutableInternalState().currentFrame).toBe(0);
  clock.nextTick();
  clock.nextTick();
  clock.nextTick();
  expect(clock.getImmutableInternalState().currentFrame).toBe(3);
});

test("trigger event on next tick", () => {
  const clock = Clock(mockTriggerEvent);
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.nextTick();
  expect(mockTriggerEvent.mock.calls).toHaveLength(3);
});

test("trigger event on next tick, multiple ticks", () => {
  const clock = Clock(mockTriggerEvent);
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.nextTick();
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.nextTick();
  clock.nextTick();
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.triggerEvent(null);
  clock.nextTick();
  expect(mockTriggerEvent.mock.calls).toHaveLength(8);
});

test("trigger event futur tick", () => {
  const clock = Clock(mockTriggerEvent);
  clock.setGameEventTimeout(null, 1);
  clock.setGameEventTimeout(null, 2);
  clock.setGameEventTimeout(null, 2);

  const queue = clock.getImmutableInternalState().timeoutQueue;
  expect(
    queue.length === 2 &&
      queue[0].frame === 1 &&
      queue[0].events.length === 1 &&
      queue[1].frame === 2 &&
      queue[1].events.length === 2,
  ).toBeTruthy();

  clock.nextTick();
  expect(mockTriggerEvent.mock.calls).toHaveLength(0);
  clock.nextTick();
  expect(mockTriggerEvent.mock.calls).toHaveLength(1);
  clock.nextTick(); // 2 events on thick 2
  expect(mockTriggerEvent.mock.calls).toHaveLength(3);
});

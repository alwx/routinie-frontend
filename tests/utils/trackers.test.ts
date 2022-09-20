import { TrackerUtils, CANNOT_BE_FULFILLED } from "../../src/utils/trackers";
import { Tracker, PatchedTracker } from "../../src/types/trackers";

const generateTracker = (data: PatchedTracker): Tracker => {
  return {
    id: "",
    title: "",
    type: "",
    color: "",
    default_value: 0,
    goal_value: 0,
    measurement: "",
    default_change: 0,
    rank: "",
    is_infinite: false,
    max_streak: 0,
    current_streak: 0,
    ...data,
  };
};

test("tracker: 0 -> 0 with `default_change` == 0", () => {
  const tracker = generateTracker({});
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(
    CANNOT_BE_FULFILLED
  );
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(
    CANNOT_BE_FULFILLED
  );
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 50)).toBe(
    CANNOT_BE_FULFILLED
  );
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -50)).toBe(
    CANNOT_BE_FULFILLED
  );
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(0);
  expect(TrackerUtils.nextValue(tracker, 50)).toBe(50);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBe(
    CANNOT_BE_FULFILLED
  );
  expect(TrackerUtils.fulfillmentProgress(tracker, 100)).toBe(
    CANNOT_BE_FULFILLED
  );
});

test("tracker: 0 -> 0 with `default_change` == 1", () => {
  const tracker = generateTracker({ default_change: 1 });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 100)).toBe(100);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -100)).toBe(-100);
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(0);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 0)).toBe(-1);
});

test("tracker: 0 -> 5 with `default_change` == 1", () => {
  const tracker = generateTracker({ goal_value: 5, default_change: 1 });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(5);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(5);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 7)).toBe(-2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 10)).toBe(-5);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(15);
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(1);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 5)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 7)).toBeGreaterThan(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, -10)).toBeLessThan(0);
});

test("tracker: 0 -> 5 with `default_change` == 5", () => {
  const tracker = generateTracker({ goal_value: 5, default_change: 5 });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 7)).toBe(-1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 100)).toBe(-19);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(3);
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(4);
  expect(TrackerUtils.nextValue(tracker, 4)).toBe(5);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 4)).toBe(9);
  expect(TrackerUtils.nextValue(tracker, 100)).toBe(100);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 100)).toBe(
    105
  );
  expect(TrackerUtils.fulfillmentProgress(tracker, -5)).toBeLessThan(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 5)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 100)).toBeGreaterThan(1);
});

test("tracker: 0 -> 5 with `default_change` == -5", () => {
  const tracker = generateTracker({ goal_value: 5, default_change: -5 });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 7)).toBe(-1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 100)).toBe(-19);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(3);
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(4);
  expect(TrackerUtils.nextValue(tracker, 4)).toBe(5);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 4)).toBe(9);
  expect(TrackerUtils.nextValue(tracker, 100)).toBe(100);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 100)).toBe(
    105
  );
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBe(0);
});

test("tracker: 1 -> 5 with `default_change` == 2", () => {
  const tracker = generateTracker({
    default_value: 1,
    goal_value: 5,
    default_change: 2,
  });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 1)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 4)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 7)).toBe(-1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 100)).toBe(-48);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -1)).toBe(3);
  expect(TrackerUtils.nextValue(tracker, 1)).toBe(3);
  expect(TrackerUtils.nextValue(tracker, 3)).toBe(5);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(5);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 5)).toBe(7);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(1);
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(2);
  expect(TrackerUtils.nextValue(tracker, 4)).toBe(5);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 4)).toBe(6);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBeLessThan(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 1)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 3)).toBe(0.5);
  expect(TrackerUtils.fulfillmentProgress(tracker, 5)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 10)).toBeGreaterThan(1);
});

test("tracker: 5 -> 1 with `default_change` == 1", () => {
  const tracker = generateTracker({
    default_value: 5,
    goal_value: 1,
    default_change: 1,
  });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(4);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 1)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(4);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 10)).toBe(9);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(-11);
  expect(TrackerUtils.nextValue(tracker, 1)).toBe(1);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 1)).toBe(0);
  expect(TrackerUtils.nextValue(tracker, 3)).toBe(2);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(4);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(-1);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, -1)).toBe(
    -2
  );
  expect(TrackerUtils.nextValue(tracker, 7)).toBe(6);
  expect(TrackerUtils.fulfillmentProgress(tracker, 5)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 3)).toBe(0.5);
  expect(TrackerUtils.fulfillmentProgress(tracker, 1)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBeGreaterThan(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 10)).toBeLessThan(0);
});

test("tracker: 5 -> 1 with `default_change` == -2", () => {
  const tracker = generateTracker({
    default_value: 5,
    goal_value: 1,
    default_change: -2,
  });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 1)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 3)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 5)).toBe(2);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 10)).toBe(5);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(-6);
  expect(TrackerUtils.nextValue(tracker, 1)).toBe(1);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 1)).toBe(-1);
  expect(TrackerUtils.nextValue(tracker, 3)).toBe(1);
  expect(TrackerUtils.nextValue(tracker, 5)).toBe(3);
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(-1);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, -1)).toBe(
    -3
  );
  expect(TrackerUtils.nextValue(tracker, 7)).toBe(5);
  expect(TrackerUtils.fulfillmentProgress(tracker, 5)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 3)).toBe(0.5);
  expect(TrackerUtils.fulfillmentProgress(tracker, 1)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBeGreaterThan(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 10)).toBeLessThan(0);
});

test("tracker: 1000 -> 8 with `default_change` == 100", () => {
  const tracker = generateTracker({
    default_value: 1000,
    goal_value: 8,
    default_change: 100,
  });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(10);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 8)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 300)).toBe(3);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 308)).toBe(3);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 309)).toBe(4);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 1000)).toBe(10);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 2000)).toBe(20);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(-1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -10)).toBe(-1);
  expect(TrackerUtils.nextValue(tracker, 1000)).toBe(900);
  expect(TrackerUtils.nextValue(tracker, 500)).toBe(400);
  expect(TrackerUtils.nextValue(tracker, 100)).toBe(8);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 100)).toBe(
    0
  );
  expect(TrackerUtils.nextValue(tracker, 0)).toBe(0);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 0)).toBe(
    -100
  );
  expect(TrackerUtils.nextValue(tracker, 2000)).toBe(1900);
  expect(TrackerUtils.fulfillmentProgress(tracker, 1000)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 8)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 0)).toBeGreaterThan(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 2000)).toBeLessThan(0);
});

test("tracker: 8 -> 996 with `default_change` == 100", () => {
  const tracker = generateTracker({
    default_value: 8,
    goal_value: 996,
    default_change: 100,
  });
  expect(TrackerUtils.totalEventsRequiredToFulfill(tracker)).toBe(10);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 8)).toBe(10);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 995)).toBe(1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 996)).toBe(0);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 1000)).toBe(-1);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, 0)).toBe(10);
  expect(TrackerUtils.eventsLeftToFulfill(tracker, -50)).toBe(11);
  expect(TrackerUtils.nextValue(tracker, 8)).toBe(108);
  expect(TrackerUtils.nextValue(tracker, 108)).toBe(208);
  expect(TrackerUtils.nextValue(tracker, 908)).toBe(996);
  expect(TrackerUtils.nextValue({ ...tracker, is_infinite: true }, 908)).toBe(
    1008
  );
  expect(TrackerUtils.nextValue(tracker, -1)).toBe(99);
  expect(TrackerUtils.fulfillmentProgress(tracker, 8)).toBe(0);
  expect(TrackerUtils.fulfillmentProgress(tracker, 996)).toBe(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 1000)).toBeGreaterThan(1);
  expect(TrackerUtils.fulfillmentProgress(tracker, 2000)).toBeGreaterThan(2);
  expect(TrackerUtils.fulfillmentProgress(tracker, -100)).toBeLessThan(0);
});

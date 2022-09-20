import { Tracker } from "../types/trackers";

export const CANNOT_BE_FULFILLED = undefined;

export class TrackerUtils {
  static totalEventsRequiredToFulfill(
    tracker: Tracker
  ): number | typeof CANNOT_BE_FULFILLED {
    if (tracker.default_change === 0) {
      return CANNOT_BE_FULFILLED;
    }
    return Math.ceil(
      Math.abs(tracker.goal_value - tracker.default_value) /
        Math.abs(tracker.default_change)
    );
  }

  static eventsLeftToFulfill(
    tracker: Tracker,
    currentValue: number
  ): number | typeof CANNOT_BE_FULFILLED {
    if (tracker.default_change === 0) {
      return CANNOT_BE_FULFILLED;
    }
    const isGoingUp = tracker.default_value < tracker.goal_value;
    if (
      (isGoingUp && currentValue >= tracker.goal_value) ||
      (!isGoingUp && currentValue <= tracker.goal_value)
    ) {
      return (
        0 -
        Math.ceil(
          Math.abs(tracker.goal_value - currentValue) /
            Math.abs(tracker.default_change)
        )
      );
    }
    return Math.ceil(
      Math.abs(tracker.goal_value - currentValue) /
        Math.abs(tracker.default_change)
    );
  }

  static nextValue(tracker: Tracker, currentValue: number): number {
    const leftToFulfill = TrackerUtils.eventsLeftToFulfill(
      tracker,
      currentValue
    );
    if (leftToFulfill === CANNOT_BE_FULFILLED) {
      return currentValue;
    }
    if (leftToFulfill <= 0 && !tracker.is_infinite) {
      return currentValue;
    }
    const isGoingUp = tracker.default_value < tracker.goal_value;
    const potentialValue =
      currentValue + Math.abs(tracker.default_change) * (isGoingUp ? 1 : -1);
    if (isGoingUp) {
      return potentialValue > tracker.goal_value && !tracker.is_infinite
        ? tracker.goal_value
        : potentialValue;
    } else {
      return potentialValue < tracker.goal_value && !tracker.is_infinite
        ? tracker.goal_value
        : potentialValue;
    }
  }

  static fulfillmentProgress(
    tracker: Tracker,
    currentValue: number
  ): number | typeof CANNOT_BE_FULFILLED {
    const totalEventsRequiredToFulfill =
      this.totalEventsRequiredToFulfill(tracker);
    if (totalEventsRequiredToFulfill === CANNOT_BE_FULFILLED) {
      return CANNOT_BE_FULFILLED;
    }
    if (totalEventsRequiredToFulfill === 0) {
      return 1; // if there are no events required to fulfill the tracker then it's fulfilled
    }
    const eventsLeftToFulfill = this.eventsLeftToFulfill(tracker, currentValue);
    if (eventsLeftToFulfill === CANNOT_BE_FULFILLED) {
      return CANNOT_BE_FULFILLED;
    }
    return (
      (totalEventsRequiredToFulfill - eventsLeftToFulfill) /
      totalEventsRequiredToFulfill
    );
  }

  static generateRank(prev: string, next: string): string {
    let p = 0,
      n = 0,
      pos,
      str;
    for (pos = 0; p === n; pos++) {
      p = pos < prev.length ? prev.charCodeAt(pos) : 96;
      n = pos < next.length ? next.charCodeAt(pos) : 123;
    }
    str = prev.slice(0, pos - 1);
    if (p === 96) {
      while (n === 97) {
        n = pos < next.length ? next.charCodeAt(pos++) : 123;
        str += "a";
      }
      if (n === 98) {
        str += "a";
        n = 123;
      }
    } else if (p + 1 === n) {
      str += String.fromCharCode(p);
      n = 123;
      while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) === 122) {
        str += "z";
      }
    }
    return str + String.fromCharCode(Math.ceil((p + n) / 2));
  }

  static rankFromTrackers(
    trackers: Tracker[],
    dragIndex: number,
    hoverIndex: number
  ): string {
    if (hoverIndex === 0) {
      return this.generateRank("", trackers[hoverIndex].rank);
    } else if (dragIndex < hoverIndex) {
      return this.generateRank(
        trackers.length > hoverIndex ? trackers[hoverIndex].rank : "",
        trackers.length > hoverIndex + 1 ? trackers[hoverIndex + 1].rank : ""
      );
    }
    return this.generateRank(
      trackers.length > hoverIndex - 1 ? trackers[hoverIndex - 1].rank : "",
      trackers.length > hoverIndex ? trackers[hoverIndex].rank : ""
    );
  }
}

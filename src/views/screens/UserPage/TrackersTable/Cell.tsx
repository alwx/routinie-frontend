import React from "react";
import { DateTime } from "luxon";
import chroma from "chroma-js";

import { Tracker, TrackerType } from "../../../../types/trackers";
import { TrackerEventType } from "../../../../types/trackerEvents";
import { TrackerEventsDict } from "../../../../utils/trackerEvents";
import {
  daysAgo,
  diffBetweenNowAndTrackerEventCreatedAt,
  toHHMMSS,
} from "../../../../utils/date";
import { CANNOT_BE_FULFILLED, TrackerUtils } from "../../../../utils/trackers";

type CellProps = {
  tracker: Tracker;
  trackerEvents: TrackerEventsDict;
  day: DateTime;
};

export const Cell = ({ tracker, trackerEvents, day }: CellProps) => {
  const [now, setNow] = React.useState<DateTime>(DateTime.now());

  const lastTrackerEvent = React.useMemo(() => {
    const date = day.toLocaleString(DateTime.DATE_SHORT);
    return (trackerEvents[date] || {})[tracker.id];
  }, [trackerEvents, day, tracker.id]);

  React.useEffect(() => {
    if (tracker.type === TrackerType.TIMER) {
      setInterval(() => setNow(DateTime.now()), 500);
    }
  }, [tracker]);

  const lastTrackerEventTrackerValue = React.useMemo(() => {
    if (tracker.type === TrackerType.DAILY && lastTrackerEvent) {
      return lastTrackerEvent.value;
    }
    if (
      tracker.type === TrackerType.TIMER &&
      lastTrackerEvent &&
      lastTrackerEvent.type === TrackerEventType.TIMER_START
    ) {
      const ago = daysAgo(day);
      if (ago === 0) {
        return (
          diffBetweenNowAndTrackerEventCreatedAt(lastTrackerEvent, now) +
          lastTrackerEvent.value
        );
      }
      // TODO(alwx): rename function; simplify
      return (
        diffBetweenNowAndTrackerEventCreatedAt(lastTrackerEvent, DateTime.fromISO(lastTrackerEvent.created_at).endOf("day")) +
        lastTrackerEvent.value
      );
    }
    if (
      tracker.type === TrackerType.TIMER &&
      lastTrackerEvent &&
      lastTrackerEvent.type === TrackerEventType.TIMER_STOP
    ) {
      return lastTrackerEvent.value;
    }
    return tracker.default_value;
  }, [day, lastTrackerEvent, tracker, now]);

  const currentFulfillmentProgress = React.useMemo(() => {
    const progress = TrackerUtils.fulfillmentProgress(
      tracker,
      lastTrackerEventTrackerValue
    );
    if (progress) {
      return Math.max(0, Math.min(progress, 1));
    }
    return CANNOT_BE_FULFILLED;
  }, [tracker, lastTrackerEventTrackerValue]);

  const backgroundColor = React.useMemo(() => {
    if (currentFulfillmentProgress) {
      return chroma(tracker.color).alpha(currentFulfillmentProgress).hex();
    }
    return "transparent";
  }, [tracker, currentFulfillmentProgress]);

  const textColor = React.useMemo(() => {
    if (
      TrackerUtils.totalEventsRequiredToFulfill(tracker) === 1 &&
      !tracker.is_infinite
    ) {
      return "transparent";
    }
    if (currentFulfillmentProgress || lastTrackerEventTrackerValue !== 0) {
      return chroma(tracker.color).darken(2).hex();
    }
    return "transparent";
  }, [tracker, currentFulfillmentProgress, lastTrackerEventTrackerValue]);

  const text = React.useMemo<string>(() => {
    if (tracker.type === TrackerType.TIMER) {
      return toHHMMSS(lastTrackerEventTrackerValue);
    }
    return "" + lastTrackerEventTrackerValue;
  }, [tracker, lastTrackerEventTrackerValue]);

  const extraCellClass = React.useMemo(() => {
    if (text.length > 5) {
      return " cell-item--smaller";
    }
    return "";
  }, [text]);

  return (
    <div
      className={"cell-item cell-item--non-updatable " + extraCellClass}
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {text}
    </div>
  );
};

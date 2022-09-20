import _ from "lodash";
import { DateTime } from "luxon";
import { TrackerEvent } from "../types/trackerEvents";

export type TrackerEventsDict = {
  [date: string]: { [trackerId: string]: TrackerEvent };
};

export const processTrackerEvents = (
  newTrackerEvents: TrackerEvent[],
  accumulator: TrackerEventsDict
): TrackerEventsDict => {
  return _.reduce(
    newTrackerEvents,
    (acc: TrackerEventsDict, e: TrackerEvent) => {
      const date = DateTime.fromISO(e.assigned_to_date, {
        setZone: false,
      }).toLocaleString(DateTime.DATE_SHORT);
      return {
        ...acc,
        [date]: {
          ...acc[date],
          [e.tracker_id]: e,
        },
      };
    },
    accumulator
  );
};

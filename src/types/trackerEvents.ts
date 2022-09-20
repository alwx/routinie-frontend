import { Tracker } from "./trackers";

export enum TrackerEventType {
  SET = "set",
  TIMER_START = "timer_start",
  TIMER_STOP = "timer_stop",
}

export type TrackerEvent = {
  id: string;
  tracker_id: string;
  type: TrackerEventType;
  value: number;
  assigned_to_date: string;
  tracker_fulfilled: boolean;
  created_at: string;
};

export type NewTrackerEvent = {
  tracker_id: string;
  type: TrackerEventType;
  value: number;
  assigned_to_date: string;
};

export type PatchedTrackerEvent = {
  value?: number;
  assigned_to_date?: string;
};

export type TrackerEventResponse = {
  tracker: Tracker;
  tracker_event: TrackerEvent;
};
export type TrackerEventsResponse = {
  tracker_events: TrackerEvent[];
};

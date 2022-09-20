import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { TrackerEvent } from "../types/trackerEvents";
import {
  processTrackerEvents,
  TrackerEventsDict,
} from "../utils/trackerEvents";

type TrackersState = {
  trackerEvents: TrackerEventsDict;
};

const initialTrackersState = {
  trackerEvents: {},
};

const slice = createSlice({
  name: "trackerEvents",
  initialState: initialTrackersState as TrackersState,
  reducers: {
    addTrackerEvents: (state, actions: PayloadAction<TrackerEvent[]>) => {
      const trackerEvents = processTrackerEvents(
        actions.payload,
        state.trackerEvents
      );
      return {
        ...state,
        trackerEvents: { ...state.trackerEvents, ...trackerEvents },
      };
    },
    removeAllTrackerEvents: (state) => {
      return initialTrackersState;
    },
  },
});

export const { addTrackerEvents, removeAllTrackerEvents } = slice.actions;
export const trackerEventsData = (state: RootState) =>
  state.trackerEvents.trackerEvents;

export default slice.reducer;

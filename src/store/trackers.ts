import _ from "lodash";
import { DateTime } from "luxon";
import { getCurrentLocalDate } from "../utils/date";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { PatchedTracker, Tracker } from "../types/trackers";

type TrackersState = {
  trackers: Tracker[];
  scrollTo: number;
};

const initialTrackersState = {
  trackers: [],
  scrollTo: getCurrentLocalDate().valueOf(),
};

const slice = createSlice({
  name: "trackers",
  initialState: initialTrackersState as TrackersState,
  reducers: {
    setTableScrollTo: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        scrollTo: action.payload,
      };
    },
    addTrackers: (state, actions: PayloadAction<Tracker[]>) => {
      const mergedTrackers = _.chain(actions.payload)
        .unionBy(state.trackers, "id")
        .sortBy(["rank"])
        .value();
      return { ...state, trackers: mergedTrackers };
    },
    updateTracker: (state, action: PayloadAction<[string, PatchedTracker]>) => {
      const [id, patchedTracker] = action.payload;
      return {
        ...state,
        trackers: state.trackers.map((tracker) => {
          if (tracker.id === id) {
            return { ...tracker, ...patchedTracker };
          }
          return tracker;
        }),
      };
    },
    removeTrackerById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      return {
        ...state,
        trackers: state.trackers.filter((tracker) => tracker.id !== id),
      };
    },
    removeAllTrackers: (state) => {
      return initialTrackersState;
    },
  },
});

export const {
  setTableScrollTo,
  addTrackers,
  updateTracker,
  removeTrackerById,
  removeAllTrackers,
} = slice.actions;
export const trackersTableScrollTo = (state: RootState) =>
  DateTime.fromMillis(state.trackers.scrollTo);
export const trackersData = (state: RootState) =>
  _.sortBy(state.trackers.trackers, ["rank", "id"]);

export default slice.reducer;

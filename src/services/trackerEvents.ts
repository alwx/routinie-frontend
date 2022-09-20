import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

import { addTrackerEvents } from "../store/trackerEvents";
import {
  NewTrackerEvent,
  PatchedTrackerEvent,
  TrackerEventResponse,
  TrackerEventsResponse,
} from "../types/trackerEvents";
import { getCurrentLocalDateOffsetInSeconds } from "../utils/date";

export const trackerEventsEndpoints = (
  build: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getTrackerEvents: build.query<
    TrackerEventsResponse,
    { since: number; until: number }
  >({
    query: ({ since, until }) => `tracker_events?since=${since}&until=${until}&timezoneOffset=${getCurrentLocalDateOffsetInSeconds()}`,
    async onQueryStarted(since, { dispatch, queryFulfilled }) {
      try {
        const result = await queryFulfilled;
        dispatch(addTrackerEvents(result.data.tracker_events));
      } catch {
        // do nothing
      }
    },
  }),
  postTrackerEvent: build.mutation<TrackerEventResponse, NewTrackerEvent>({
    query: (trackerEvent) => ({
      url: `tracker_events?timezoneOffset=${getCurrentLocalDateOffsetInSeconds()}`,
      method: "POST",
      body: trackerEvent,
    }),
  }),
  patchTrackerEvent: build.mutation<
    TrackerEventResponse,
    { trackerEvent: PatchedTrackerEvent; id: string }
  >({
    query: ({ trackerEvent, id }) => ({
      url: `tracker_events/${id}?timezoneOffset=${getCurrentLocalDateOffsetInSeconds()}`,
      method: "PATCH",
      body: trackerEvent,
    }),
  }),
});

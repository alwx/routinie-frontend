import { NewTracker, PatchedTracker, TrackerResponse } from "../types/trackers";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

export const trackersEndpoints = (
  build: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getTracker: build.query<TrackerResponse, { id: string }>({
    query: ({ id }) => `trackers/${id}`,
  }),
  postTracker: build.mutation<TrackerResponse, NewTracker>({
    query: (tracker) => ({
      url: "trackers",
      method: "POST",
      body: tracker,
    }),
  }),
  patchTracker: build.mutation<
    TrackerResponse,
    { patchedTracker: PatchedTracker; id: string }
  >({
    query: ({ patchedTracker, id }) => ({
      url: `trackers/${id}`,
      method: "PATCH",
      body: patchedTracker,
    }),
  }),
  deleteTracker: build.mutation<TrackerResponse, { id: string }>({
    query: ({ id }) => ({
      url: `trackers/${id}`,
      method: "DELETE",
    }),
  }),
});

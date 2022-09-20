import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { usersEndpoints } from "./users";
import { trackersEndpoints } from "./trackers";
import { trackerEventsEndpoints } from "./trackerEvents";
import { sampleTrackersEndpoints } from "./sampleTrackers";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const api = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: "include" }),
  endpoints: (build) => ({
    ...usersEndpoints(build),
    ...trackersEndpoints(build),
    ...trackerEventsEndpoints(build),
    ...sampleTrackersEndpoints(build),
  }),
});

export const {
  useGetUserQuery,
  useGetPublicUserQuery,
  useCreateUserMutation,
  usePatchUserMutation,
  useRemindPasswordMutation,
  useSetPasswordMutation,
  useLoginMutation,

  useGetTrackerQuery,
  usePostTrackerMutation,
  usePatchTrackerMutation,
  useDeleteTrackerMutation,

  useGetTrackerEventsQuery,
  usePostTrackerEventMutation,
  usePatchTrackerEventMutation,

  useGetSampleTrackersQuery,
} = api;

import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { SampleTrackerResponse } from "../types/sampleTrackers";

export const sampleTrackersEndpoints = (
  build: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getSampleTrackers: build.query<SampleTrackerResponse, { tag: string }>({
    query: ({ tag }) => `sample_trackers?tag=${tag}`,
  }),
});

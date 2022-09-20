import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type NetworkState = {
  activeQueries: string[];
};

const initialNetworkState = {
  activeQueries: [],
};

const slice = createSlice({
  name: "network",
  initialState: initialNetworkState as NetworkState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("/pending");
        },
        (state, action) => {
          const name = action.meta?.arg.endpointName;
          if (name) {
            return {
              ...state,
              activeQueries: [...state.activeQueries, name],
            };
          }
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.endsWith("/fulfilled") ||
            action.type.endsWith("/rejected")
          );
        },
        (state, action) => {
          const name = action.meta?.arg.endpointName;
          if (name) {
            return {
              ...state,
              activeQueries: state.activeQueries.filter(
                (active) => active !== name
              ),
            };
          }
        }
      );
  },
});

export const hasActiveQueries = (state: RootState) =>
  state.network.activeQueries.length > 0;

export default slice.reducer;

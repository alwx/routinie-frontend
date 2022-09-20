import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type AppState = {
  windowSize: {
    width: number;
    height: number;
  };
};

const initialAppState = {
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
};

const slice = createSlice({
  name: "app",
  initialState: initialAppState as AppState,
  reducers: {
    setWindowSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      return {
        ...state,
        windowSize: {
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    },
  },
});

export const { setWindowSize } = slice.actions;
export const appWindowSize = (state: RootState) => state.app.windowSize;

export default slice.reducer;

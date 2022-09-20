import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContextMenu } from "../types/contextMenu";
import { RootState } from "../store";

export type ContextMenuState = {
  contextMenu?: ContextMenu;
  closedAt?: Date;
};

export const initialState: ContextMenuState = {
  closedAt: new Date(),
};

export const slice = createSlice({
  name: "contextMenu",
  initialState,
  reducers: {
    updateContextMenu: (state, action: PayloadAction<ContextMenu>) => {
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          data: undefined,
          isBlockingView: false,
          ...action.payload,
        },
        closedAt: undefined,
      };
    },
    closeContextMenu: (state) => {
      state.closedAt = new Date();
    },
  },
});

export const { updateContextMenu, closeContextMenu } = slice.actions;
export const contextMenu = (state: RootState) => state.contextMenu.contextMenu;
export const contextMenuClosedAt = (state: RootState) =>
  state.contextMenu.closedAt;

export default slice.reducer;

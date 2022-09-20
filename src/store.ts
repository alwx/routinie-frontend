import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./store/app";
import contextMenuReducer from "./store/contextMenu";
import trackersReducer from "./store/trackers";
import trackerEventsReducer from "./store/trackerEvents";
import networkReducer from "./store/network";
import usersReducer from "./store/users";
import { api } from "./services";

export const store = configureStore({
  reducer: {
    app: appReducer,
    contextMenu: contextMenuReducer,
    trackers: trackersReducer,
    trackerEvents: trackerEventsReducer,
    network: networkReducer,
    users: usersReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["contextMenu"],
        ignoredActions: ["contextMenu/updateContextMenu"],
      },
    }).concat(api.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

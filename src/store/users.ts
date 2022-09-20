import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../types/users";
import type { RootState } from "../store";

type UsersState = {
  lastUserResponse: UserResponse | null;
  shouldLoadSince: number;
  isJustRegistered: boolean;
};

const initialUsersState = {
  lastUserResponse: null,
  shouldLoadSince: 0,
  isJustRegistered: false,
};

const getLastUserResponse = (): any => {
  return JSON.parse(localStorage.getItem("lastUserResponse") || "{}");
};

const saveLastUserResponse = (data: any) => {
  localStorage.setItem(
    "lastUserResponse",
    JSON.stringify({ ...getLastUserResponse(), ...data })
  );
};

const removeUserData = () => {
  window.localStorage.clear();
  document.cookie = `${process.env.REACT_APP_ID}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = "cookiename= ; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${process.env.REACT_APP_ID}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${process.env.REACT_APP_DOMAIN}`;
  document.cookie = `cookiename= ; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${process.env.APP_DOMAIN}`;
};

const slice = createSlice({
  name: "users",
  initialState: initialUsersState as UsersState,
  reducers: {
    getUserDataFromLocalStorage: (state) => {
      const lastUserResponse = getLastUserResponse();
      const isJustRegistered = Boolean(
        localStorage.getItem("isJustRegistered")
      );
      return {
        ...state,
        lastUserResponse: lastUserResponse,
        shouldLoadSince: lastUserResponse?.until || 0,
        isJustRegistered: isJustRegistered,
      };
    },
    setIsJustRegistered: (state, action: PayloadAction<boolean>) => {
      const isJustRegistered = action.payload;
      if (isJustRegistered) {
        localStorage.setItem("isJustRegistered", "true");
      } else {
        localStorage.removeItem("isJustRegistered");
      }
      return {
        ...state,
        isJustRegistered: action.payload,
      };
    },
    logUserOut: (state) => {
      removeUserData();
      return initialUsersState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ({ type, meta }) => {
          return (
            type.endsWith("/fulfilled") &&
            ["getUser", "createUser", "patchUser", "login"].indexOf(
              meta?.arg?.endpointName
            ) > -1
          );
        },
        (state, { payload }) => {
          const userResponse = payload as UserResponse;
          if (!userResponse) {
            return state;
          }
          // this is needed to strip the unnecessary fields
          // the subclasses of `UserResponse` might have
          const responseToSave = {
            user: userResponse.user,
            until: userResponse.until,
          };
          saveLastUserResponse(responseToSave);
          const newResponse: UserResponse = {
            ...state.lastUserResponse,
            ...responseToSave,
          };
          return { ...state, lastUserResponse: newResponse };
        }
      )
      .addMatcher(
        ({ type, payload, meta }) => {
          return (
            type.endsWith("/rejected") &&
            meta?.arg?.endpointName === "getUser" &&
            payload?.status === 403
          );
        },
        (state, x) => {
          saveLastUserResponse(null);
          return { ...state, lastUserResponse: null };
        }
      );
  },
});

export const { getUserDataFromLocalStorage, setIsJustRegistered, logUserOut } =
  slice.actions;
export const currentUser = (state: RootState) =>
  state.users.lastUserResponse?.user;
export const shouldLoadSince = (state: RootState) =>
  state.users.shouldLoadSince;
export const isJustRegistered = (state: RootState) =>
  state.users.isJustRegistered;

export default slice.reducer;

import {
  GetUserResponse,
  NewUser,
  PatchedUser,
  UserResponse,
} from "../types/users";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { addTrackers } from "../store/trackers";
import { GetPublicUserResponse } from "../types/publicUsers";
import { getCurrentLocalDateOffsetInSeconds } from "../utils/date";

export const usersEndpoints = (
  build: EndpointBuilder<BaseQueryFn, string, string>
) => ({
  getUser: build.query<GetUserResponse, null>({
    query: () => `users?timezoneOffset=${getCurrentLocalDateOffsetInSeconds()}`,
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      try {
        const result = await queryFulfilled;
        dispatch(addTrackers(result.data.trackers));
      } catch {
        // do nothing
      }
    },
  }),
  getPublicUser: build.query<GetPublicUserResponse, { name: string }>({
    query: ({ name }) => {
      return `users/${name}?timezoneOffset=${getCurrentLocalDateOffsetInSeconds()}`;
    },
  }),
  createUser: build.mutation<UserResponse, NewUser>({
    query: (user) => ({
      url: "users/create",
      method: "POST",
      body: user,
    }),
  }),
  patchUser: build.mutation<UserResponse, PatchedUser>({
    query: (user) => ({
      url: "users",
      method: "PATCH",
      body: user,
    }),
  }),
  remindPassword: build.mutation<any, { email: string }>({
    query: (data) => ({
      url: "users/remind-password",
      method: "POST",
      body: data,
    }),
  }),
  setPassword: build.mutation<
    any,
    { email: string; remind_password_token: string; password: string }
  >({
    query: (data) => ({
      url: "users/set-password",
      method: "POST",
      body: data,
    }),
  }),
  login: build.mutation<UserResponse, { email: string; password: string }>({
    query: (credentials) => ({
      url: "users/login",
      method: "POST",
      body: credentials,
    }),
  }),
});

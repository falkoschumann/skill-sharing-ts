// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { configureStore } from "@reduxjs/toolkit";

import talksReducer from "./talks_slice";
import { TalksApi } from "../infrastructure/talks_api";
import { UsersRepository } from "../infrastructure/users_repository";

export const store = createStore(TalksApi.create(), UsersRepository.create());

export function createStore(
  talksApi: TalksApi,
  usersRepository: UsersRepository,
) {
  return configureStore({
    reducer: {
      talks: talksReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { talksApi, usersRepository },
        },
      }),
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

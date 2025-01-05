// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { configureStore } from '@reduxjs/toolkit';

import { UserRepository } from '../infrastructure/user_repository.ts';
import talksReducer from './talks_slice.ts';
import userReducer from './user_slice.ts';
import { TalksApi } from '../infrastructure/talks_api.ts';

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function createStore(
  talksApi = TalksApi.create(),
  userRepository = UserRepository.create(),
) {
  return configureStore({
    reducer: {
      talks: talksReducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { talksApi, userRepository },
        },
      }),
  });
}

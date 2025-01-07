// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { configureStore } from '@reduxjs/toolkit';

import { UserRepository } from '../infrastructure/user_repository.ts';
import talksReducer from './talks_slice.ts';
import userReducer from './user_slice.ts';
import { TalksApi } from '../infrastructure/talks_api.ts';

// TODO Use default store instead of nulled store
//export const store = createStore();

const talksApi = TalksApi.createNull();
export const store = createStore(
  talksApi,
  UserRepository.createNull(),
);
setTimeout(() =>
  talksApi.simulateMessage([{
    title: 'Foobar',
    presenter: 'Anon',
    summary: 'Lorem ipsum.',
    comments: [
      {
        'author': 'Bob',
        'message': 'Great!',
      },
      {
        'author': 'Anon',
        'message': 'Thanks!',
      },
    ],
  }]), 2000);

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

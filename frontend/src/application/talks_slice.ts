// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { TalksQuery, TalksQueryResult } from "../domain/messages";
import type { Talk } from "../domain/talks";
import type { User } from "../domain/users";
import { TalksApi } from "../infrastructure/talks_api";
import { UsersRepository } from "../infrastructure/users_repository";

interface TalksState {
  readonly talks: Talk[];
  readonly user: string;
}

const initialState: TalksState = {
  talks: [],
  user: "Anon",
};

type TalksThunkConfig = {
  extra: {
    talksApi: TalksApi;
    userRepository: UsersRepository;
  };
};

const talksSlice = createSlice({
  name: "talks",
  initialState,
  reducers: {
    userChanged: (state, action: PayloadAction<User>) => {
      state.user = action.payload.username;
    },
  },
  extraReducers: (builder) => {
    // Change user
    builder.addCase(changeUser.fulfilled, (state, action) => {
      state.user = action.payload.username;
    });

    // TODO Replace with SSE
    // Query talks
    builder.addCase(queryTalks.fulfilled, (state, action) => {
      state.talks = action.payload.talks;
    });
  },
  selectors: {
    selectTalks: (state) => state.talks,
    selectUser: (state) => state.user,
  },
});

const start = createAsyncThunk<void, void, TalksThunkConfig>(
  "talks/start",
  async (_action, thunkApi) => {
    const { userRepository } = thunkApi.extra;

    const user = await userRepository.load();
    thunkApi.dispatch(userChanged({ username: user?.username ?? "Anon" }));
  },
);

const changeUser = createAsyncThunk<User, User, TalksThunkConfig>(
  "talks/changeUser",
  async ({ username }, thunkApi) => {
    const { userRepository } = thunkApi.extra;
    await userRepository.store({ username });
    return { username };
  },
);

const queryTalks = createAsyncThunk<
  TalksQueryResult,
  TalksQuery,
  TalksThunkConfig
>("talks/queryTalks", async (query: TalksQuery, thunkApi) => {
  const { talksApi } = thunkApi.extra;
  return talksApi.queryTalks(query);
});

export default talksSlice.reducer;

// Sync actions
const { userChanged } = talksSlice.actions;

// Async thunks
export { changeUser, start, queryTalks };

// Selectors
export const { selectTalks, selectUser } = talksSlice.selectors;

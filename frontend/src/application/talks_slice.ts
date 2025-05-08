// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { CommandStatus, TalksQueryResult } from "../domain/messages";
import type { Talk } from "../domain/talks";
import type { User } from "../domain/users";
import { TalksApi } from "../infrastructure/talks_api";
import { UsersRepository } from "../infrastructure/users_repository";

interface TalksState {
  readonly talks: Talk[];
  readonly user: User;
}

const initialState: TalksState = {
  talks: [],
  user: { username: "Anon" },
};

type TalksThunkConfig = {
  readonly state: { talks: TalksState };
  readonly extra: {
    readonly talksApi: TalksApi;
    readonly usersRepository: UsersRepository;
  };
};

const talksSlice = createSlice({
  name: "talks",
  initialState,
  reducers: {
    userChanged: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    talksUpdated: (state, action: PayloadAction<TalksQueryResult>) => {
      state.talks = action.payload.talks;
    },
  },
  extraReducers: (builder) => {
    // Change user
    builder.addCase(changeUser.fulfilled, (state, action) => {
      state.user = action.payload;
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
    const { talksApi, usersRepository } = thunkApi.extra;

    // TODO Replace with SSE
    const result = await talksApi.queryTalks({});
    thunkApi.dispatch(talksUpdated(result));

    const user = await usersRepository.load();
    thunkApi.dispatch(userChanged({ username: user?.username ?? "Anon" }));
  },
);

const changeUser = createAsyncThunk<User, User, TalksThunkConfig>(
  "talks/changeUser",
  async ({ username }, thunkApi) => {
    const { usersRepository } = thunkApi.extra;
    await usersRepository.store({ username });
    return { username };
  },
);

const submitTalk = createAsyncThunk<
  CommandStatus,
  { title: string; summary: string },
  TalksThunkConfig
>("talks/submitTalk", async ({ title, summary }, thunkApi) => {
  const { talksApi } = thunkApi.extra;
  const { username } = selectUser(thunkApi.getState());
  const command = { title, presenter: username, summary };
  return talksApi.submitTalk(command);
});

const addComment = createAsyncThunk<
  CommandStatus,
  { title: string; message: string },
  TalksThunkConfig
>("talks/addComment", async ({ title, message }, thunkApi) => {
  const { talksApi } = thunkApi.extra;
  const { username } = selectUser(thunkApi.getState());
  const command = { title, comment: { author: username, message } };
  return talksApi.addComment(command);
});

const deleteTalk = createAsyncThunk<
  CommandStatus,
  { title: string },
  TalksThunkConfig
>("talks/deleteTalk", async ({ title }, thunkApi) => {
  const { talksApi } = thunkApi.extra;
  const command = { title };
  return talksApi.deleteTalk(command);
});

export default talksSlice.reducer;

// Sync actions
const { talksUpdated, userChanged } = talksSlice.actions;

// Async thunks
export { addComment, changeUser, deleteTalk, start, submitTalk };

// Selectors
export const { selectTalks, selectUser } = talksSlice.selectors;

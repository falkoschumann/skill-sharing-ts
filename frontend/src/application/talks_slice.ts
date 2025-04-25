// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { TalksQuery, TalksQueryResult } from "../domain/messages.ts";
import { Talk } from "../domain/talks.ts";
import { TalksApi } from "../infrastructure/talks_api.ts";

interface TalksState {
  readonly talks: Talk[];
}

const initialState: TalksState = {
  talks: [],
};

type TalksThunkConfig = {
  extra: {
    talksApi: TalksApi;
  };
};

const talksSlice = createSlice({
  name: "talks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Query talks
    builder.addCase(queryTalks.fulfilled, (state, action) => {
      state.talks = action.payload.talks;
    });
  },
  selectors: {
    selectTalks: (state) => state.talks,
  },
});

const queryTalks = createAsyncThunk<
  TalksQueryResult,
  TalksQuery,
  TalksThunkConfig
>("talks/queryTalks", async (query: TalksQuery, thunkApi) => {
  const { talksApi } = thunkApi.extra;
  return talksApi.queryTalks(query);
});

export default talksSlice.reducer;

// Async Thunks
export { queryTalks };

// Selectors
export const { selectTalks } = talksSlice.selectors;

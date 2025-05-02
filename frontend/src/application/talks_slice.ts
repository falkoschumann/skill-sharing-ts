// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instanceToPlain } from "class-transformer";

import {
  Talk,
  TalksQuery,
  TalksQueryResult,
} from "@skill-sharing/shared/domain";
import { TalksApi } from "../infrastructure/talks_api";

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
  const result = await talksApi.queryTalks(query);
  return instanceToPlain(result) as TalksQueryResult;
});

export default talksSlice.reducer;

// Async Thunks
export { queryTalks };

// Selectors
export const { selectTalks } = talksSlice.selectors;

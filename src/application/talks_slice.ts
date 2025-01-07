// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { Talk } from '../domain/talks.ts';
import { TalksApi, TalksUpdatedEvent } from '../infrastructure/talks_api.ts';
import { createAppSlice } from './create_app_slice.ts';
import { User } from '../domain/user.ts';

type TalksThunkConfig = {
  extra: { readonly talksApi: TalksApi };
};

const userSlice = createAppSlice({
  name: 'talks',
  initialState: [] as Talk[],
  reducers: (create) => ({
    connect: create.asyncThunk<void, void, TalksThunkConfig>(
      async (_arg, thunkAPI) => {
        const { talksApi } = thunkAPI.extra;
        talksApi.addEventListener(TalksUpdatedEvent.TYPE, (event) => {
          const talksUpdatedEvent = event as TalksUpdatedEvent;
          thunkAPI.dispatch(talksUpdated(talksUpdatedEvent.talks));
        });
        await talksApi.connect();
      },
    ),
    submitTalk: create.asyncThunk<
      void,
      { title: string; summary: string },
      TalksThunkConfig
    >(
      async ({ title, summary }, thunkAPI) => {
        const state = thunkAPI.getState() as { user: User };
        const presenter = state.user.username;
        const command = { title, presenter, summary };
        const { talksApi } = thunkAPI.extra;
        await talksApi.submitTalk(command);
      },
    ),
    addComment: create.asyncThunk<
      void,
      { title: string; message: string },
      TalksThunkConfig
    >(
      async ({ title, message }, thunkAPI) => {
        const { talksApi } = thunkAPI.extra;
        const state = thunkAPI.getState() as { user: User };
        const author = state.user.username;
        const comment = { author, message };
        await talksApi.addComment({ title, comment });
      },
    ),
    deleteTalk: create.asyncThunk<
      void,
      { title: string },
      TalksThunkConfig
    >(
      async ({ title }, thunkAPI) => {
        const { talksApi } = thunkAPI.extra;
        await talksApi.deleteTalk({ title });
      },
    ),
    talksUpdated: create.reducer<Talk[]>((_state, action) => {
      return action.payload;
    }),
  }),
});

export const { connect, submitTalk, addComment, deleteTalk, talksUpdated } =
  userSlice.actions;
export default userSlice.reducer;

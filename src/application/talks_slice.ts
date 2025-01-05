// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { Talk } from '../domain/talks.ts';
import { TalksApi } from '../infrastructure/talks_api.ts';
import { SubmitTalkCommand } from './messages.ts';
import { createAppSlice } from './create_app_slice.ts';

type TalksThunkConfig = {
  extra: { readonly talksApi: TalksApi };
};

const userSlice = createAppSlice({
  name: 'talks',
  initialState: [] as Talk[],
  reducers: (create) => ({
    // TODO connect
    // TODO test submit talk
    submitTalk: create.asyncThunk<void, SubmitTalkCommand, TalksThunkConfig>(
      async (command, thunkAPI) => {
        const { talksApi } = thunkAPI.extra;
        await talksApi.submitTalk(command);
      },
    ),
    // TODO add comment
    // TODO delete talk
    talksUpdated: create.reducer<Talk[]>((_state, action) => {
      return action.payload;
    }),
  }),
});

export const { talksUpdated } = userSlice.actions;
export default userSlice.reducer;

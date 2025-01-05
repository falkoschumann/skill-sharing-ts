// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { PayloadAction } from '@reduxjs/toolkit';

import { User } from '../domain/user.ts';
import { UserRepository } from '../infrastructure/user_repository.ts';
import { createAppSlice } from './create_app_slice.ts';

type UserThunkConfig = {
  extra: { readonly userRepository: UserRepository };
};

const userSlice = createAppSlice({
  name: 'user',
  initialState: { username: 'Anon' } as User,
  reducers: (create) => ({
    loadUser: create.asyncThunk<User, void, UserThunkConfig>(
      async (_arg, thunkAPI) => {
        const { userRepository } = thunkAPI.extra;
        const user = await userRepository.load();
        return user ?? { username: 'Anon' };
      },
      {
        fulfilled: (state, action: PayloadAction<User>) => {
          state.username = action.payload.username;
        },
      },
    ),
    changeUser: create.asyncThunk<User, User, UserThunkConfig>(
      async (user: User, thunkAPI) => {
        const { userRepository } = thunkAPI.extra;
        await userRepository.store(user);
        return user;
      },
      {
        fulfilled: (state, action: PayloadAction<User>) => {
          state.username = action.payload.username;
        },
      },
    ),
    userChanged: create.reducer<User>(
      (state, action) => {
        state.username = action.payload.username;
      },
    ),
  }),
});

export const { loadUser, changeUser, userChanged } = userSlice.actions;
export default userSlice.reducer;

import { IUserInfo, IUserState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState: IUserState = {
  evmAddress: '',
  loginToken: '',
  userInfo: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEvmAddress: (state, action: PayloadAction<string>) => {
      state.evmAddress = action.payload;
    },
    setLoginToken: (state, action: PayloadAction<string>) => {
      state.loginToken = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<IUserInfo | undefined>) => {
      state.userInfo = action.payload;
    },
    // 清空所有用户状态
    clearUserState: (state) => {
      state.evmAddress = '';
      state.loginToken = '';
      state.userInfo = undefined;
    },
  },
})
export const {
  setEvmAddress,
  setLoginToken,
  setUserInfo,
  clearUserState,
} = userSlice.actions;
export default userSlice.reducer;


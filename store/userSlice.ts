import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

interface UserState {
  userInfo: UserInfo | null
  isLoggedIn: boolean
}

const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
      state.isLoggedIn = true
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload }
      }
    },
    logout: (state) => {
      state.userInfo = null
      state.isLoggedIn = false
    },
  },
})

export const { setUserInfo, updateUserInfo, logout } = userSlice.actions

export default userSlice.reducer


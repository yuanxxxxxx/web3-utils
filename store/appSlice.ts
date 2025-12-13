import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Language = 'zh' | 'en'

interface AppState {
  isDarkMode: boolean
  language: Language
}

const initialState: AppState = {
  isDarkMode: false,
  language: 'zh',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
  },
})

export const { toggleDarkMode, setDarkMode, setLanguage } = appSlice.actions

export default appSlice.reducer


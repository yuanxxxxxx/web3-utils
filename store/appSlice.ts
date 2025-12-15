import { IAppState, LANGUAGE_ENUM, THEME_ENUM } from '@/types'
import { WEBSITE_CONFIG } from '@/types/constant'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'




const initialState: IAppState = {
  theme: WEBSITE_CONFIG.defaultTheme,
  language: WEBSITE_CONFIG.defaultLanguage,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<THEME_ENUM>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<LANGUAGE_ENUM>) => {
      state.language = action.payload
    },
  },
})

export const { setTheme, setLanguage } = appSlice.actions

export default appSlice.reducer


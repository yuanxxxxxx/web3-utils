import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLanguage } from '@/store/appSlice'
import { LanguageToggleContainer, Select } from './style'
export default function LanguageToggle() {
  const {language } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()
  return (
    <LanguageToggleContainer>
    <Select
          value={language}
          onChange={(e) => dispatch(setLanguage(e.target.value as any))}
        >
          <option value="zh">🇨🇳 中文</option>
          <option value="en">🇺🇸 English</option>
        </Select>
    </LanguageToggleContainer>
  )
}
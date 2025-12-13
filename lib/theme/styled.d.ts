// styled-components 类型定义
import 'styled-components'
import { Theme } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

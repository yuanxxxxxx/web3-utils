// 主题媒体查询
export enum THEME_MEDIA_ENUM {
  large = "@media screen and (min-width: 1200px)",
  medium = "@media screen and (max-width: 1199px)",
  small = "@media screen and (max-width: 835px)",
}

// 主题配置
export const lightTheme = {
  primary: '#0066EA',
  bg1: '#FFFFFF',
}

export const darkTheme = {
  primary: '#0066EA',
  bg1: '#000000',
}

export type Theme = typeof lightTheme

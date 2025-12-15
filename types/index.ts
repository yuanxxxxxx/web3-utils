export enum LANGUAGE_ENUM {
  zh = "zh",
  en = "en",
}

export enum THEME_ENUM {
  light = "light",
  dark = "dark",
}

export interface IAppState {
  theme: THEME_ENUM
  language: LANGUAGE_ENUM
}

export interface IUserState {
  evmAddress: string,
  loginToken: string,
  userInfo?: IUserInfo,
}

// API 响应类型定义
export interface IUserInfo {
  id: number;
  walletAddress: string;
  nickname: string;
  balance: string;
  frozenBalance: string;
  availableBalance: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}


export interface ILoginResponse {
  accessToken: string;
  user: IUserInfo;
}

export interface INonceResponse {
  nonce: string;
}

export interface IApiError {
  statusCode: number;
  message: string;
  error: string;
}
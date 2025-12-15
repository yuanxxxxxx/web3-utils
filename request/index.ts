import { IApiError, ILoginResponse, INonceResponse, IUserInfo } from "@/types";
import { LOGIN_TOKEN_LOCAL_KEY, WEBSITE_CONFIG } from "@/types/constant";
import toast from "react-hot-toast"
import axios, { AxiosResponse, AxiosError } from "axios";

// ==================== API 基础配置 ====================

const API_BASE_URL = WEBSITE_CONFIG.API_BASE_URL;

// 创建 HTTP 客户端实例
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== 请求拦截器 ====================

// 添加 JWT Token 到请求头
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOGIN_TOKEN_LOCAL_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== 全局登出回调 ====================
// 用于在响应拦截器中触发登出操作
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

// ==================== 响应拦截器（统一错误处理）====================

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 成功响应直接返回 data
    return response.data;
  },
  (error: AxiosError<IApiError>) => {
    // 统一错误处理
    if (error.response) {
      const { statusCode, message } = error.response.data;
      
      switch (statusCode) {
        case 401:
          // Token 过期或无效，清除本地存储、Redux状态并断开钱包连接
          localStorage.removeItem(LOGIN_TOKEN_LOCAL_KEY);
          toast.error('Login expired, please login again');
          // 调用全局登出回调，断开钱包连接并清除状态
          if (globalLogoutCallback) {
            globalLogoutCallback();
          }
          break;
        case 400:
          // 参数错误
          toast.error(message || 'Invalid request parameters');
          break;
        case 403:
          // 无权限
          toast.error('No permission to access');
          break;
        case 404:
          // 资源不存在
          toast.error('Resource not found');
          break;
        case 409:
          // 冲突（如重复操作）
          toast.error(message || 'Operation conflict');
          break;
        case 500:
          // 服务器错误
          toast.error('Server error, please try again later');
          break;
        default:
          toast.error(message || 'Request failed');
      }
    } else if (error.request) {
      // 请求发送但无响应（网络问题）
      toast.error('Network connection failed');
    } else {
      // 其他错误
      toast.error('Unknown error occurred');
    }
    
    return Promise.reject(error);
  }
);

// ==================== 认证模块 API ====================

/**
 * 获取登录 Nonce
 * @param walletAddress 钱包地址
 */
export const getNonce = async (walletAddress: string): Promise<INonceResponse> => {
  return httpClient.get(`/auth/nonce`, {
    params: { walletAddress }
  });
};

/**
 * SIWE 登录
 * @param message SIWE 消息文本
 * @param signature MetaMask 签名
 */
export const login = async (message: string, signature: string): Promise<ILoginResponse> => {
  return httpClient.post('/auth/login', {
    message,
    signature,
  });
};

/**
 * 获取当前用户信息
 */
export const getProfile = async (): Promise<IUserInfo> => {
  return httpClient.get('/auth/profile');
};




// ==================== 其他工具 API ====================

export const getCoinbaseTokenPrice = (token: 'ETH') => {
  return axios.get(`https://api.coinbase.com/v2/prices/${token}-USD/spot`)
}

export const pinataUploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(WEBSITE_CONFIG.pinadaConfig.apiUrl+"/pinning/pinFileToIPFS", formData, {
    headers: {
      'Authorization': `Bearer ${WEBSITE_CONFIG.pinadaConfig.jwt}`
    }
  })
}
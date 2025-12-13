/**
 * 环境配置工具函数
 * Environment configuration utilities
 */

// 获取当前环境
export const getEnv = () => {
  return process.env.NEXT_PUBLIC_ENV || 'local';
};

// 判断是否为生产环境
export const isProduction = () => {
  return getEnv() === 'production';
};

// 判断是否为开发环境
export const isDevelopment = () => {
  const env = getEnv();
  return env === 'development' || env === 'local';
};

// 判断是否为测试环境
export const isTest = () => {
  return getEnv() === 'test';
};

// 获取 API 地址
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

// 获取应用名称
export const getAppName = () => {
  return process.env.NEXT_PUBLIC_APP_NAME || 'New CLI';
};

// 环境配置对象
export const envConfig = {
  env: getEnv(),
  apiUrl: getApiUrl(),
  appName: getAppName(),
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  isTest: isTest(),
};

// 打印环境信息（仅在非生产环境）
if (!isProduction() && typeof window !== 'undefined') {
  console.log('🔧 Environment Config:', envConfig);
}

'use client';

import { StyledEnvIndicator } from './style';

export const EnvIndicator = () => {
  const env = process.env.NEXT_PUBLIC_ENV || 'unknown';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'New CLI';
  
  // 不在生产环境时显示环境指示器
  if (env === 'production') {
    return null;
  }

  return (
    <StyledEnvIndicator $env={env}>
      <span className="env-badge">{env.toUpperCase()}</span>
      <span className="app-name">{appName}</span>
    </StyledEnvIndicator>
  );
};

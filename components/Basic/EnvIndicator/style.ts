import styled from 'styled-components';

interface StyledEnvIndicatorProps {
  $env: string;
}

const getEnvColor = (env: string) => {
  switch (env) {
    case 'local':
      return '#10b981'; // green
    case 'development':
      return '#3b82f6'; // blue
    case 'test':
      return '#f59e0b'; // orange
    case 'production':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

export const StyledEnvIndicator = styled.div<StyledEnvIndicatorProps>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ $env }) => getEnvColor($env)};
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  font-size: 12px;
  font-weight: 500;
  z-index: 9999;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .env-badge {
    padding: 4px 8px;
    background: ${({ $env }) => getEnvColor($env)};
    color: white;
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .app-name {
    color: ${({ theme }) => theme.primary};
  }

  @media (max-width: 768px) {
    bottom: 8px;
    right: 8px;
    font-size: 10px;
    padding: 6px 10px;

    .env-badge {
      padding: 3px 6px;
    }
  }
`;

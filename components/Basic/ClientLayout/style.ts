import { styled } from "styled-components";

export const LayoutParent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.bg1};
  font-family: 'PlusJakartaSans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

export const LayoutContent = styled.div`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
`;
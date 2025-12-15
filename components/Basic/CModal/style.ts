import styled from "styled-components";
import {THEME_MEDIA_ENUM} from "@/lib/theme/theme";

export const ModalView = styled.div<{ zIndex?: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background: rgba(0, 0, 0, 0.6);
  z-index: ${({zIndex}) => zIndex};
  opacity: 0;
  transition: opacity 0.3s;
  backdrop-filter: blur(5px);

  &.animating {
    opacity: 1;
  }
  ${THEME_MEDIA_ENUM.small}{
    padding: 20px;
    box-sizing: border-box;
  }
`;

export const ModalViewBox = styled.div<{ width: string | number, paddingBox?: string,showLine?:boolean, scroll?: boolean,bg?:string }>`
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  border-radius: 12px;
  border: 1px solid #FFFFFF33;
  background: #ffffff;
  padding: ${({paddingBox}) => paddingBox || '12px 12px 16px 12px'};
  width: ${({width}) => (typeof width === "number" ? `${width}px` : width)};
  max-width: 98vw;
  max-height: 100vh;
  overflow-y: ${({ scroll }) => scroll ? 'auto' : 'visible'};
  
  .modal-header {
    display: flex;
    align-items: center;
    position: relative;
    padding: 8px;
    margin-bottom: 12px;
    h1 {
      flex: 1;
      font-weight: 600;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0px;
      vertical-align: middle;
      color: #000;
    }
    .modal-x{
      cursor: pointer;
      &>img{
        width: 16px;
        height: 16px;
      }
    }
  }
  ${THEME_MEDIA_ENUM.small}{

    padding: ${({paddingBox}) => paddingBox || '12px'};
    .modal-header {

      padding: 0px;
      margin-bottom: 8px;
      h1 {
        flex: 1;
        color: #FFF;
        font-family: Helvetica;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      .modal-x{
        cursor: pointer;
        &>img{
          width: 16px;
          height: 16px;
        }
      }
    }
  }
`;

export const ModalContentView = styled.div<{ padding: string }>`
  padding: ${({padding}) => padding};
`;

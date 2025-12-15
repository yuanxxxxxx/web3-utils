import React, {useEffect, useState} from "react";
import {ModalContentView, ModalView, ModalViewBox} from "./style";
import ReactDOM from "react-dom";
import cs from "classnames";
import CloseSvg from '@/public/images/icon/x.svg'

interface Props {
  propsClassName?: string;
  children?: React.ReactNode;
  width?: string | number;
  visible: boolean;
  onClose?: Function;
  title?: any;
  showHeader?: boolean;
  padding?: string;
  paddingBox?: string;
  zIndex?: number;
  showLine?: boolean
  scroll?: boolean
  bg?:string
}

export default function CModal(
  {
    propsClassName = "",
    children,
    width = "446px",
    visible,
    onClose,
    title,
    showHeader = true,
    padding = "0",
    paddingBox,
    zIndex = 99,
    showLine = true,
    scroll = true,
    bg
  }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [load, setLoad] = useState<boolean>(false)
  const closeModal = () => {
    if (!onClose){
      return
    }
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  useEffect(() => {
    if (visible){
      setTimeout(() => {
        setIsAnimating(true)
      },20)
    }
  }, [visible])
  useEffect(() => {
    setLoad(true)
  }, [])

  if (!visible || !load){
    return null
  }
  const doc = document.body
  return ReactDOM.createPortal(<ModalView className={cs(propsClassName, isAnimating && 'animating')} zIndex={zIndex}>
    <ModalViewBox
      className="modal-view-box"
      width={width}
      paddingBox={paddingBox}
      showLine={showLine}
      scroll={scroll}
      bg={bg}
    >
      {showHeader && (
        <div className="modal-header">
          <h1>{typeof title === "function" ? title() : title}</h1>
          {
            onClose && <div className="modal-x" onClick={() => closeModal()}>
              <img src={CloseSvg.src} alt=""/>
            </div>
          }
        </div>
      )}
      <ModalContentView padding={padding}>{children}</ModalContentView>
    </ModalViewBox>
  </ModalView>,doc)
}

import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { TooltipContainer } from "./style";
export default function CTooltip({overlay, strokeColor}: {overlay: React.ReactNode|string, strokeColor?: string}) {
  return <Tooltip placement="bottom" trigger={['hover']}  overlay={<TooltipContainer>
    {overlay}
  </TooltipContainer>}>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: "pointer",
    }}
  >
<path d="M8 8L8 11M8 5.77637V5.75M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z" stroke={strokeColor||"white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    </Tooltip>
}
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useChainId, useClient, useConnection, useDisconnect } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { IUserState } from "../types";
import { clearUserState } from "@/store/userSlice";
import { LOGIN_TOKEN_LOCAL_KEY } from "@/types/constant";
import { Client } from "viem";


export default function useActiveWeb3React() {
  const { address, isConnecting, chainId } = useConnection()
  const { evmAddress } = useSelector((state: { user: IUserState }) => state.user)
  const dispatch = useDispatch()
  const disconnect = useDisconnect()
  const { openConnectModal } = useConnectModal();
  const client = useClient()
  /**
   * 登出逻辑：
   * 1. 断开钱包连接
   * 2. 清除 Redux 中的所有用户状态
   * 3. 清除 localStorage 中的 Token
   */
  const loginOut = () => {
    // 断开钱包连接
    disconnect.mutate()
    
    // 清除 Redux 中的所有用户状态（包括地址、Token、余额、用户信息等）
    dispatch(clearUserState())
    
    // 清除本地存储的 Token
    localStorage.removeItem(LOGIN_TOKEN_LOCAL_KEY)
  }
  
  return {
    account: evmAddress || '',
    account_: address,
    chainId,
    loginOut,
    isConnecting,
    openConnectModal: () => openConnectModal && openConnectModal(),
    client,
  } as {
    account: string;
    account_: string;
    chainId: number;
    loginOut: () => void;
    isConnecting: boolean;
    openConnectModal: () => void;
    client: Client;
  }
}

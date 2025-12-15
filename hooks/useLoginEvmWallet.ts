import { useConnection, useSignMessage } from "wagmi";
import { IUserState } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef } from "react";
import { setEvmAddress, setLoginToken, setUserInfo } from "@/lib/store/userSlice";
import lodash from 'lodash';
import { WEBSITE_CONFIG, LOGIN_TOKEN_LOCAL_KEY } from "../types/constant";
import useActiveWeb3React from "./useActiveWeb3React";
import { SiweMessage } from 'siwe';
import { getNonce, login, getProfile, setGlobalLogoutCallback } from "../request";
import toast from "react-hot-toast";

export default function useLoginEvmWallet() {
  const signMessage = useSignMessage()
  const { address } = useConnection()
  const { loginToken } = useSelector((state: { user: IUserState }) => state.user)
  const dispatch = useDispatch()
  const { loginOut } = useActiveWeb3React()
  
  // 用于追踪上一次的地址，检测地址变化
  const previousAddressRef = useRef<string | undefined>(address)
  
  // 用于防止登录失效后自动重新拉起签名
  const isLoggedOutRef = useRef<boolean>(false)

  
  // 注册全局登出回调，用于在401错误时自动登出
  useEffect(() => {
    if (!WEBSITE_CONFIG.needSignLogin) {
      return;
    }
    setGlobalLogoutCallback(() => {
        isLoggedOutRef.current = true; // 设置标志，防止自动重新登录
        loginOut();
      });
    
  }, [loginOut]);

  /**
   * SIWE 登录流程实现
   */
  const loginEvmWallet = async () => {
    // 如果没有钱包地址，直接返回
    if (!address) {
      return;
    }
    
    // 检测地址变化，如果地址改变了，清除旧的 token 和状态
    if (previousAddressRef.current && previousAddressRef.current !== address) {
      localStorage.removeItem(LOGIN_TOKEN_LOCAL_KEY);
      dispatch(setLoginToken(''));
      dispatch(setEvmAddress(''));
      dispatch(setUserInfo(undefined));
      // 重置登出标志，允许新地址登录
      isLoggedOutRef.current = false;
    }
    
    // 更新地址引用
    previousAddressRef.current = address;
    
    // 如果被登出（401错误或用户主动登出），则不再自动拉起签名
    if (isLoggedOutRef.current) {
      return;
    }
    
    // 如果已经登录（有 token），则不需要重新登录
    if (loginToken) {
      return;
    }

    // 检查本地是否有保存的 Token
    const savedToken = localStorage.getItem(LOGIN_TOKEN_LOCAL_KEY)
    if (address && savedToken) {
      dispatch(setEvmAddress(address))
      dispatch(setLoginToken(savedToken))
      
      // 尝试获取用户信息以验证 token 是否有效
      try {
        const userInfo = await getProfile()
        dispatch(setUserInfo(userInfo))
        // Token 有效，清除登出标志
        isLoggedOutRef.current = false;
      } catch (error) {
        // Token 可能已过期或无效，清除本地存储（不再自动重新登录）
        console.error('Token validation failed:', error);
        localStorage.removeItem(LOGIN_TOKEN_LOCAL_KEY);
        dispatch(setLoginToken(''));
        // 设置登出标志，防止自动重新拉起签名
        isLoggedOutRef.current = true;
      }
      return
    }

    // 开始 SIWE 登录流程
    try {
      // 步骤 1: 获取 nonce
      const { nonce } = await getNonce(address)
      // 步骤 2: 处理 nonce（去掉连字符，SIWE 不支持）
      const cleanNonce = nonce.replace(/-/g, '')

      // 步骤 3: 构造 SIWE 消息
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: `Sign in to ${WEBSITE_CONFIG.appName}`,
        uri: window.location.origin,
        version: '1',
        chainId: WEBSITE_CONFIG.defaultChain.id,
        nonce: cleanNonce,
        issuedAt: new Date().toISOString(),
      })

      // 步骤 4: 生成要签名的文本
      const messageToSign = siweMessage.prepareMessage()

      // 步骤 5: 使用 MetaMask 签名
      let signature: string
      try {
        signature = await signMessage.mutateAsync({
          message: messageToSign,
        })
      } catch (error) {
        console.error('User rejected signature:', error)
        toast.error('Signature cancelled')
        isLoggedOutRef.current = true; // 设置标志，防止自动重试
        loginOut()
        return
      }

      // 步骤 6: 提交签名并获取 JWT
      const loginResponse = await login(messageToSign, signature)
      
      // 步骤 7: 保存 Token 和用户信息
      const { accessToken, user } = loginResponse
      localStorage.setItem(LOGIN_TOKEN_LOCAL_KEY, accessToken)
      dispatch(setEvmAddress(address))
      dispatch(setLoginToken(accessToken))
      dispatch(setUserInfo(user))
      
      // 登录成功，清除登出标志
      isLoggedOutRef.current = false;
      
    } catch (error: any) {
      console.error('Login failed', error)
      // 设置登出标志，防止自动重试
      isLoggedOutRef.current = true;
      // 错误已在拦截器中处理，这里只需清理状态
      loginOut()
    }
  }

  // 使用 lodash.debounce 防抖，避免频繁调用
  const debouncedLogin = useMemo(() => 
    lodash.debounce(loginEvmWallet, 300), 
    [address, loginToken]
  );

  useEffect(() => {
    if (!WEBSITE_CONFIG.needSignLogin) {
      dispatch(setEvmAddress(address || ''))
      return;
    }
    debouncedLogin();
    return () => {
      debouncedLogin.cancel();
    };
  }, [address, loginToken]);

}

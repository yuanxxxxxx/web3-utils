import { useEffect, useState } from "react";

export default function useNow() {
  // 初始值设为 0，避免 SSR hydration 不匹配
  const [now, setNow] = useState(0);
  
  useEffect(() => {
    // 首次挂载时立即设置当前时间
    setNow(Math.floor(Date.now()/1000));
    
    // 每秒更新一次
    const interval = setInterval(() => setNow(Math.floor(Date.now()/1000)), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return now;
}
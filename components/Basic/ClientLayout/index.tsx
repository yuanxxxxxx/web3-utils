"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Basic/Header";
import { LayoutContent, LayoutParent } from "./style";
import BigNumber from "bignumber.js";
import "@/public/styles/reset.css";

// 处理Bignumbe.js自然数最大值问题
BigNumber.config({
  CRYPTO: true,
  DECIMAL_PLACES: 100,
  EXPONENTIAL_AT: [-20, 40]
});

export default function ClientLayout({children}: {children: React.ReactNode}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LayoutParent>
      {mounted && (
        <>
          <Header />
          <LayoutContent>{children}</LayoutContent>
        </>
      )}
    </LayoutParent>
  );
}

"use client";

import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Header from "@/components/Basic/Header";

const LayoutParent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const LayoutContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

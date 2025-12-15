import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/theme/registry";
import StoreProvider from "@/store/StoreProvider";
import I18nProvider from "@/lib/I18nProvider";
import Web3Provider from "@/lib/web3/Web3Provider";
import ClientLayout from "@/components/Basic/ClientLayout";
import { WEBSITE_CONFIG } from "@/types/constant";

export const metadata: Metadata = {
  title: WEBSITE_CONFIG.appTitle,
  description: WEBSITE_CONFIG.appDescription,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <I18nProvider>
            <Web3Provider>
              <StyledComponentsRegistry>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </StyledComponentsRegistry>
            </Web3Provider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

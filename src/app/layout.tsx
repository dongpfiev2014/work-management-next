import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import { Suspense } from "react";
import Loading from "./loading";
import Script from "next/script";
import { ConfigProvider } from "antd";
import MainLayout from "@/components/MainLayout/MainLayout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { cookies } from "next/headers";

const font = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Work Management",
  description: "A project for efficient work management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = cookies();
  // const refreshToken = cookieStore.get("refreshToken");
  // console.log(refreshToken);

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </head>
      <body className={font.className}>
        <StoreProvider>
          <Suspense fallback={<Loading loading={true} />}>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: font.style.fontFamily,
                    fontSize: 14,
                  },
                  components: {
                    Form: {
                      marginLG: 15,
                    },
                  },
                }}
              >
                <ProtectedRoute>
                  <MainLayout>
                    <main>{children}</main>
                  </MainLayout>
                </ProtectedRoute>
              </ConfigProvider>
            </AntdRegistry>
          </Suspense>
        </StoreProvider>
      </body>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      />
    </html>
  );
}

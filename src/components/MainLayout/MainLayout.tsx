"use client";

import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import Navigation from "../Navigation/Navigation";
import { Affix, Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage =
    ["/account/login", "/account/signup", "/forgot-password"].includes(
      pathname
    ) ||
    (pathname.startsWith("/reset-password/") &&
      pathname.split("/").length === 4);

  return (
    <>
      {!isAuthPage ? (
        <Layout>
          <Affix>
            <MainHeader />
          </Affix>
          <Content>
            <Layout className={styles.container}>
              <div className={styles.wrapper}>
                <Sider style={{ backgroundColor: "white" }}>
                  <div className={styles.sidebar}>
                    <Navigation />
                  </div>
                </Sider>
                <Content>
                  <main className={styles.main}>{children}</main>
                </Content>
              </div>
            </Layout>
          </Content>
          <Footer>
            <MainFooter />
          </Footer>
        </Layout>
      ) : (
        <Content>
          <main>{children}</main>
        </Content>
      )}
    </>
  );
};

export default MainLayout;

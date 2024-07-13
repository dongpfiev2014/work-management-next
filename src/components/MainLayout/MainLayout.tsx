"use client";

import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";
import React, { useEffect, useState } from "react";
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
          <Content className={styles.container}>
            <Layout className={styles.wrapper}>
              <Sider className={styles.sidebar}>
                <Navigation />
              </Sider>
              <Content>
                <main className={styles.main}>{children}</main>
              </Content>
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

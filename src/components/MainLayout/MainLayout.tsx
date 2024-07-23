"use client";

import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import Navigation from "../Navigation/Navigation";
import { Affix, Button, Drawer, Grid, Layout } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { MenuOutlined } from "@ant-design/icons";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isAuthPage =
    ["/account/login", "/account/signup", "/forgot-password"].includes(
      pathname
    ) ||
    (pathname.startsWith("/reset-password/") &&
      pathname.split("/").length === 4);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <>
      {!isAuthPage ? (
        <Layout>
          <Affix>
            <MainHeader />
          </Affix>
          <Content className={styles.container}>
            <Layout className={styles.wrapper}>
              {screens.lg ? (
                <Sider className={styles.sidebar}>
                  <Navigation />
                </Sider>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<MenuOutlined />}
                    onClick={toggleDrawer}
                    style={{
                      position: "fixed",
                      zIndex: 1000,
                      top: "20px",
                      left: "5px",
                    }}
                  />
                  <Drawer
                    title="Navigation"
                    placement="left"
                    onClose={toggleDrawer}
                    visible={drawerVisible}
                    style={{ width: "300px", maxWidth: "300px" }}
                  >
                    <Navigation />
                  </Drawer>
                </>
              )}
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

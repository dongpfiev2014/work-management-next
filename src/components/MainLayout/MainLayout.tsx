"use client";

import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import Navigation from "../Navigation/Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/account/login" || pathname === "/account/signup";

  return (
    <>
      {!isLoginPage &&
        !(pathname === "/forgot-password") &&
        !(
          pathname.startsWith("/reset-password/") &&
          pathname.split("/").length === 4
        ) && <MainHeader />}
      {!isLoginPage &&
      !(pathname === "/forgot-password") &&
      !(
        pathname.startsWith("/reset-password/") &&
        pathname.split("/").length === 4
      ) ? (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
              <Navigation />
            </aside>
            <main className={styles.main}>{children}</main>
          </div>
        </div>
      ) : (
        <main className={styles.main}>{children}</main>
      )}
      {!isLoginPage &&
        !(pathname === "/forgot-password") &&
        !(
          pathname.startsWith("/reset-password/") &&
          pathname.split("/").length === 4
        ) && <MainFooter />}
    </>
  );
};

export default MainLayout;

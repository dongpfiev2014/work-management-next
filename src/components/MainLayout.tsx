"use client";

import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter";
import React from "react";
import { usePathname } from "next/navigation";

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
      <main>{children}</main>
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

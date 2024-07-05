"use client";

import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import React from "react";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isLoginPage && <MainHeader />}
      <main>{children}</main>
      {!isLoginPage && <MainFooter />}
    </>
  );
};

export default MainLayout;

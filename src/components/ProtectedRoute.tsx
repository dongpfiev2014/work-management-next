"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { userInfo } from "@/selector/userSelector";
import { fetchUser } from "@/reducer/authReducer";
import { usePathname, useRouter } from "next/navigation";
import { message } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userState = useAppSelector(userInfo);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const pathname = usePathname();
  const isLoginPage =
    pathname === "/account/login" || pathname === "/account/signup";

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (accessToken && accessToken !== "undefined" && accessToken !== null) {
        // Gọi action fetchUser với accessToken
        await dispatch(fetchUser());
      } else {
        if (
          !isLoginPage &&
          !(pathname === "/forgot-password") &&
          !(
            pathname.startsWith("/reset-password/") &&
            pathname.split("/").length === 4
          ) &&
          userState.message
        ) {
          messageLogOut();
        } else {
          router.push("/account/login");
        }
      }
    };
    fetchUserInfo();
  }, [accessToken]);

  const messageLogOut = () => {
    return new Promise<void>((resolve) => {
      messageApi
        .open({
          type: "success",
          content: "Sign out successful!",
          duration: 0.5,
        })
        .then(() =>
          messageApi.open({
            type: "loading",
            content: "Redirecting to login page...",
            duration: 1,
            onClose: () => {
              router.push("/account/login");
              resolve();
            },
          })
        );
    });
  };

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute;

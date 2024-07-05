"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { userInfo } from "@/selector/userSelector";
import { fetchUser } from "@/reducer/authReducer";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userState = useAppSelector(userInfo);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (
          accessToken &&
          accessToken !== "undefined" &&
          accessToken !== null
        ) {
          // Gọi action fetchUser với accessToken
          await dispatch(fetchUser(accessToken));
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    };
    fetchUserInfo();
  }, [dispatch, accessToken, router]);

  useEffect(() => {
    if (userState.currentUser) {
      if (!userState.success) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    }
  }, [userState, router]);

  return <>{children}</>;
};

export default ProtectedRoute;

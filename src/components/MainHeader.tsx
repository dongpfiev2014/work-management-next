"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/reducer/authReducer";
import { userInfo } from "@/selector/userSelector";
import { Button } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { app } from "@/config/config";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const MainHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  console.log(userState);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setGoogleUser(user);
      } else {
        // router.push("/account/login");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    try {
      const response = await signOut(auth);
      // router.push("/account/login");
    } catch (error: any) {
      console.error("Error signing out", error.message);
    }
    if (accessToken) {
      dispatch(signout());
    }
  };

  return (
    <header className="d-flex ">
      <nav>
        <ul>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/function">Function</Link>
          </li>
          <li>
            <Link href="/conmemay">
              Hello {userState.currentUser?.fullName}
            </Link>
          </li>
        </ul>
      </nav>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </header>
  );
};

export default MainHeader;

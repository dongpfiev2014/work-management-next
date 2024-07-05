"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/reducer/authReducer";
import { userInfo } from "@/selector/userSelector";
import { Button } from "antd";
// import logoImg from "@/assets/checklist.png";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MainHeader = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(userInfo);
  console.log(userState);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleSignOut = () => {
    if (accessToken) {
      dispatch(signout(accessToken));
      router.push("/login");
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
        </ul>
      </nav>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </header>
  );
};

export default MainHeader;

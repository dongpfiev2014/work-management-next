"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/reducer/authReducer";
import { userInfo } from "@/selector/userSelector";
import { Button, message } from "antd";
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
  const [messageApi, contextHolder] = message.useMessage();

  const handleSignOut = () => {
    if (accessToken) {
      dispatch(signout(accessToken));
      messageLogOut();
    }
  };

  const messageLogOut = () => {
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
          onClose: () => router.push("/account/login"),
        })
      );
  };

  return (
    <header className="d-flex ">
      {contextHolder}
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

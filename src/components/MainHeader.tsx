"use client";

import Link from "next/link";
import logoImg from "@/assets/checklist.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainHeader = () => {
  const path = usePathname();
  console.log(path);
  return (
    <header>
      <Link href="/">
        <Image src={logoImg} alt="Work Management" priority />
        <p>Let get started</p>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <p>fdsafasd123456789178</p>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;

"use client";

import Link from "next/link";
import logoImg from "@/assets/checklist.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MainHeader = () => {
  const path = usePathname();
  return (
    <header>
      <Link href="/">
        <Image src={logoImg} alt="Work Management" priority />
      </Link>
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

    </header>
  );
};

export default MainHeader;

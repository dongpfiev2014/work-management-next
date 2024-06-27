import Link from "next/link";
import logoImg from "@/assets/checklist.png";
import Image from "next/image";

const MainHeader = () => {
  return (
    <header>
      <Link href="/">
        <Image src={logoImg} alt="Work Management" />
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
          <p>fdsafasd1234567891</p>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;

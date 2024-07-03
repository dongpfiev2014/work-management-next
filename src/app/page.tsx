import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link href="/about">About us</Link>
        <Link href="/hahaha">fafsdf</Link>
      </div>
    </main>
  );
}

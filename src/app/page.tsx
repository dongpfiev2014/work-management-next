"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link href="/about">About us</Link>
        <Link href="/hahaha">fafsdf</Link>
        <p>
          After 40 years, he passed away, and left her a letter which said: “My
          dearest, please forgive me, forgive my life’s lie. This was the only
          lie I said to you – the salty coffee.
        </p>
        <ul>
          <li>123</li>
        </ul>
        <button type="button" className="btn btn-primary">
          Primary
        </button>
      </div>
    </main>
  );
}

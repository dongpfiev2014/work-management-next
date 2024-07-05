import Image from "next/image";
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
          lie I said to you – the salty coffee. Remember the first time we
          dated? I was so nervous at that time, actually I wanted some sugar,
          but I said salt, it was hard for me to change so I just went ahead. I
          never thought that would be the start of my biggest lie. I tried to
          tell you the truth many times in my life, but I was too afraid to, as
          I had promised never to lie to you.
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

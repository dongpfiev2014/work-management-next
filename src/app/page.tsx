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
          I had promised never to lie to you. Now I’m dying, and afraid of
          nothing so I will tell you the truth: I don’t like salty coffee, what
          a strange bad taste! But I have had salty coffee for my whole life.
          Since I have known you, I have never felt sorry for anything I have
          done for you. Having you with me is the biggest happiness of my life.
          If I could live again, I would want to know you and have you for my
          whole life, even if I had to drink the salty coffee again.” Her tears
          made the letter totally wet. Some day, someone asked her: “How does
          salty coffee taste?” “It’s sweet,” she replied.{" "}
        </p>
        <ul>
          <li>123</li>
          <li>1234</li>
          <li>1235</li>
          <li>1236</li>
        </ul>
        <button type="button" className="btn btn-primary">
          Primary
        </button>
        <button type="button" className="btn btn-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-success">
          Success
        </button>
        <button type="button" className="btn btn-danger">
          Danger
        </button>
        <button type="button" className="btn btn-warning">
          Warning
        </button>
        <button type="button" className="btn btn-info">
          Info
        </button>
        <button type="button" className="btn btn-light">
          Light
        </button>
        <button type="button" className="btn btn-dark">
          Dark
        </button>
        <button type="button" className="btn btn-link">
          Link
        </button>
      </div>
    </main>
  );
}

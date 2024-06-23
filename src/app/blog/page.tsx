import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div>
        <h1>Page</h1>
        <p>
          <Link href="/blog/post-1">Post-1</Link>
        </p>
        <p>
          <Link href="/blog/post-2">Post-2</Link>
        </p>
      </div>
    </main>
  );
}

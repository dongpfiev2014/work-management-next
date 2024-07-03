import Link from "next/link";

export default function Page() {
  console.log("rendering in server");
  return (
    <main>
      <div>
        <h1>Page</h1>
        <p>
          <Link href="/blog/post-1">Post-100</Link>
        </p>
        <p>
          <Link href="/blog/post-2">Post-234</Link>
        </p>
      </div>
    </main>
  );
}

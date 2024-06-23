export default function Page({ params }) {
  return (
    <div>
      <h1>Blogspot 123</h1>
      <p>{params.slug}</p>
    </div>
  );
}

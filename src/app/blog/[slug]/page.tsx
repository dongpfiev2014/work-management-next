export default function Page({ params }) {
  return (
    <div>
      <h1>Blog details</h1>
      <p>{params.slug}</p>
    </div>
  );
}

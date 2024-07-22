"use client";

import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  console.log(search);

  return <div>Search : </div>;
};

export default page;

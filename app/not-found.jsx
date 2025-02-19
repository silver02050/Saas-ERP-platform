"use client"
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation'

const NotFound = () => {

  const router = useRouter()

  return (
    <div className="w-full h-[80vh] flex flex-col justify-center gap-4 text-center p-4 ">
      <span className=" font-bold text-5xl text-warning ">404</span>
      <span className="font-bold text-4xl dark:text-sky-500 text-primary">
        Page Not Found
      </span>
      <button onClick={router.back}>Back</button>
      <Link href="/" className="underline">
        Back to home page?
      </Link>
    </div>
  );
};

export default NotFound;

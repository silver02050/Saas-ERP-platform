"use client"
import DashBoard from "../components/DashBoard";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function Home() {
  return (
    <section id="dashboard" className="flex min-w-[80%] h-full">
      <Suspense fallback={<Loading size="5x" />}>
        <DashBoard />
      </Suspense>
    </section>
  );
}

"use client";
// import { api } from "~/trpc/server";
import { trpc } from "~/trpc/client";

export default function Home() {
  // const { message } = await api.chaicode.query({ email: "aman@gmail.com" });
  const { data } = trpc.chaicode.useQuery({ name: "Aman", email: "aman@that.com", age: 69 });
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h2>Server Message: {data?.message}</h2>
      </div>
    </main>
  );
}

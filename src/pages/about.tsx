import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b3bd6] to-[#f8a221]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            About <span className="text-[hsl(280,100%,70%)]">Agent</span> App
          </h1>
          <h1 className="text-5xl font-extrabold leading-normal text-white md:text-[5rem]">
            <span className="text-2xl font-bold text-white"></span>
          </h1>

          <p className="text-2xl font-bold ">
  Works as a calculator
          </p>
    
        </div>
      </main>
    </>
  );
};

export default Home;

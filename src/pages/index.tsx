import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SocialIcon } from "react-social-icons";
import { trpc } from "../utils/trpc";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
 
interface FormData {

  alivePigNo:number;
  alivekg:number;
  pricePerKg:number;
  slaugherPrice:number;
  transferPrice:number;
  revievedNetKG:number;
  netKgAfterkatharisma:number;
}

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();
  const { data: session, status } = useSession();
  // {((formData.pricePerKg*formData.alivekg)+formData.slaugherPrice+formData.transferPrice)/formData.revievedNetKG}
  const netAfterkatharismaPricePerKg= (afterCosts:number , wholeCost: number)=>{
 
    const all=parseInt(afterCosts.toString())+ parseInt(wholeCost.toString())
    return ( all / parseInt(formData.netKgAfterkatharisma.toString()) )
    }
  const netPricePerKg= (afterCosts:number , wholeCost: number)=>{
 
    const all=parseInt(afterCosts.toString())+ parseInt(wholeCost.toString())
    return ( all / parseInt(formData.revievedNetKG.toString()) )
    }
const afterCosts= (tcost:number , scost: number)=>{
return parseInt(tcost.toString())+parseInt(scost.toString())
}
  const [formData, setFormData] = useState<FormData>({

    alivekg:0,
    alivePigNo:0,
    pricePerKg:0,
    slaugherPrice:0,
    transferPrice:0,
    revievedNetKG:0,
    netKgAfterkatharisma:0
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Perform any necessary form submission logic here
    console.log(formData);
  };

  const { data: paralaves }  = trpc.auth.getParalaves.useQuery();
  if (paralaves) {
    paralaves.sort((a, b) => {
      const dateA = a.RecievedAt.getTime();
      const dateB = b.RecievedAt.getTime();
  
      return  dateB-dateA;
    });
  }
  const NewArrival = trpc.auth.NewArrival.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
    },
  });


  const   hadnleArrival=async ()=>{
    try {
    const id=await (await NewArrival.mutateAsync({text:""})).id
    router.push('/paralavi/'+id); 
    } catch (cause) {
      console.error({ cause }, "Failed to add post");
    }
  }
  return (
    <>
      <Head>
        <title>B-Inventory</title>
        <meta name="description" content="Verbal Agent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
   
        
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
           <span className="text-[hsl(280,100%,70%)]"> P</span>aralaves
          </h1>
          <div>
          {paralaves && paralaves.map((paralavi, index) => {
  return (
    <div key={index} className="border border-gray-500 rounded-xl m-4 p-3">
        <Link  href={"/paralavi/"+paralavi.id}> <> <div>Paralavi ID: {paralavi.id}</div>
      <div >Recieved At: {paralavi.RecievedAt.toDateString()}<> </>{paralavi.RecievedAt.toLocaleTimeString()}</div>
      </>
      </Link>
    </div>
  );
})}
  



    </div>
         
            <button onClick={hadnleArrival} className="rounded-full bg-orange-400 p-6 text-white">
            +  New Arrival
            </button>
       
      </main>
    </>
  );
};

export default Home;

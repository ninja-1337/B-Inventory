import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SocialIcon } from "react-social-icons";
import { trpc } from "../utils/trpc";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Switch, Spacer } from "@nextui-org/react";


const Home: NextPage = () => {
const [editMode ,setEditMode]= useState(false)
  const router = useRouter();
  const { data: session, status } = useSession();
  // {((formData.pricePerKg*formData.alivekg)+formData.slaugherPrice+formData.transferPrice)/formData.revievedNetKG}
  

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
  const delArrival = trpc.auth.DeleteArrival.useMutation({
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
  const   deleteArrival=async (id: string)=>{
    try {
    await (await delArrival.mutateAsync({text:id}))
    window.location.reload();
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
          </h1><span className="pt-2"><span className="pt-0">Enable Editing</span>
          <span>
          <Switch  className="pt-2" size="xs" onChange={()=>{
          
               setEditMode(!editMode)
            
          }} preventDefault={false} checked={editMode} ></Switch></span></span>
          <div>
          {paralaves && paralaves.map((paralavi) => {
  return (
   
    
    <div key={paralavi.id} className="border border-gray-500 rounded-xl m-4 p-3">
    <a href={`/paralavi/${paralavi.id.toString()}`} >
        <> <div>Order ID: {paralavi.id}</div>
      <div >Recieved At: {paralavi.RecievedAt.toDateString()}<> </>{paralavi.RecievedAt.toLocaleTimeString()}{paralavi.netKgAfterkatharisma=='NaN' && <span className="ml-1  text-red-700 min-w-fit max-w-fit rounded-lg bg-red-600">🗡️</span> } {paralavi.netKgAfterkatharisma.toString()=='NaN' || <span  className="ml-1 text-green-700 min-w-fit max-w-fit rounded-lg bg-green-600">🗡️</span> } </div>
      {paralavi.netKgAfterkatharisma.toString()=='NaN' || <div  className="ml-0 text-green-700 min-w-fit max-w-fit rounded-lg bg-green-200 opacity-60">Net Clean:{paralavi.netKgAfterkatharisma.toString()+" Kg"} </div> }
      </>
      </a>
      {editMode ? <button onClick={()=>{deleteArrival(paralavi.id)}}  className="rounded-lg bg-red-500  mt-0 p-1 z-0">Delete</button>:<></>}
   
    </div>
 

     
 
  );
})}
  



    </div>
         
            <button onClick={hadnleArrival} className="rounded-full bg-orange-400 p-6  text-white">
            +  New Arrival
            </button>
       
      </main>
    </>
  );
};

export default Home;

import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SocialIcon } from "react-social-icons";
import { trpc } from "../../utils/trpc";
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


  return (
    <>
      <Head>
        <title>B-Inventory</title>
        <meta name="description" content="Verbal Agent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
   
       
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
           <span className="text-[hsl(280,100%,70%)]"> B </span> inventory
          </h1>
          <p>Arrival ID: {router.query.inventory}</p>
        <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-extrabold tracking-tight ">
           <span className="text-[hsl(280,100%,70%)]">  </span> Alive
          </h2>
          <div>
        <label htmlFor="name">Alive Pig Number:</label>
        <input
          type="number"
          id="alivePigNo"
          name="alivePigNo"
          value={formData.alivePigNo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Alive KG in Total:</label>
        <input
          type="number"
          id="alivekg"
          name="alivekg"
          value={formData.alivekg}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Alive Price Per KG :</label>
        <input
          type="number"
          id="pricePerKg"
          name="pricePerKg"
          value={formData.pricePerKg}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Whole Alive Costs :</label>
       {formData.alivekg*formData.pricePerKg}  <label htmlFor="name">€</label>
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight ">
           <span className="text-[hsl(280,100%,70%)]">  </span> + Costs After
          </h2>
      <div>
        <label htmlFor="name">Slaugher Costs :</label>
        <input
          type="number"
          id="slaugherPrice"
          name="slaugherPrice"
          value={formData.slaugherPrice}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Transfer Costs :</label>
        <input
          type="number"
          id="transferPrice"
          name="transferPrice"
          value={formData.transferPrice}
          onChange={handleChange}
        />
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight ">
           <span className="text-[hsl(280,100%,70%)]">  </span> Paralavi
          </h2>
      <div>
        <label htmlFor="name">Net Recieved Kg :</label>
        <input
          type="number"
          id="revievedNetKG"
          name="revievedNetKG"
          value={formData.revievedNetKG}
          onChange={handleChange}
        />
      </div>
      
      <div>

        <label htmlFor="name">Net Recieved Price Per Kg :</label>
        {netPricePerKg(afterCosts(formData.slaugherPrice,formData.transferPrice),(formData.alivekg*formData.pricePerKg) )}
        <label htmlFor="name">€</label>
      </div>
      <div>
        <label htmlFor="name">KG After Katharisma :</label>
        <input
          type="number"
          id="netKgAfterkatharisma"
          name="netKgAfterkatharisma"
          value={formData.netKgAfterkatharisma}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="name">Cost Per KG After Katharisma :</label>
        {netAfterkatharismaPricePerKg(afterCosts(formData.slaugherPrice,formData.transferPrice),(formData.alivekg*formData.pricePerKg) )}
       <label htmlFor="name">€</label>
      </div>
    
      <button type="submit">Submit</button>
    </form>
        {/* {!session && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <>
            <div className="rounded bg-orange-400 p-1" color="inherit">
              Please login to send me a message
            </div>
            <div>
              <button onClick={() => signIn("google")}>
                <SocialIcon
                  network="google"
                  style={{ height: 25, width: 25 }}
                />
              </button>
              <button onClick={() => signIn("discord")}>
                <SocialIcon
                  network="discord"
                  style={{ height: 25, width: 25 }}
                />
              </button>
            </div>
          </>
        )}{session && (
          <>

            <p className="text-black-600  bold text-3xl">Previous Messages</p>
           
          </>
        )} */}
           <Link href="/ai">
            <button className="rounded-full bg-orange-400 p-6 text-white">
            +  New Arrival
            </button>
          </Link>
      </main>
    </>
  );
};

export default Home;

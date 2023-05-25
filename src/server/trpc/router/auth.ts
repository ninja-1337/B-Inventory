import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { connect } from "tls";
import { object, string } from "zod";
import { z } from "zod";
export type Message = {
  who: "bot" | "user" | undefined;
  message?: string;
};
function validateArray(input: any): any {
  console.log("validateArray called with iput", input);
  return false;
}
type Value = {
  value1: string;
  value2: string;
};

function validateSingleValue(input: Value): any {
  console.log("validateSingleValue called with iput", input);
  return false;
}

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "Content just for authenticated Users";
  }),
  getSecretMessage2: protectedProcedure.query(() => {
    return "Content just for authenticated Users";
  }),
  getAgents: protectedProcedure.query(({ ctx }) => {
    return prisma.agents.findMany({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  getUserAgents: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.agents.findMany({
          where: {
        OR: [
          {
            OR: [
           {userId: ctx.session.user.id}
            ]
          },
          {
            OR: [
             {userId:'clfspjtrl0000ld086bf6h44e'}
            ]
          }
        ]
        ,
      },
    });
  }),
  getParalaves: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.paralaves.findMany({

    });
  }),

  getParalaviById: publicProcedure
  .input(z.object({ text: z.string().nullish() }).nullish())
  .query(({ ctx,input}) => {
    return ctx.prisma.paralaves.findUnique({
      where: {
        id:input?.text?.toString()
      },
    });
  }),
  getUserMessages: protectedProcedure
  .input(z.object({ text: z.string().nullish() }).nullish())
  .query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        sent_by: true, // Return all fields
      },
    });
  }),
  getUserSavedChat: protectedProcedure.query(({ ctx, input }) => {
    return ctx.prisma.aichats.findMany({
      where: {
        userId : ctx.session.user.id ,
      
      },
      // include: {
      //   sent_by: true, // Return all fields
      // },
    });
  }),
  getUserDiscoverable: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  saveChat: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.aichats.create({
        data: {
          
        userId:ctx.session?.user.id,
        chat:{
          input
        }
        },
      });
    }),
    getParalavByID: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.paralaves.findUnique({
        where: {
          id:input.toString()
        },
      });
    }),
  add: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.guestbook.create({
        data: {
          email: "" + ctx.session?.user?.email,
          body: input.text,
          userId: ctx.session?.user.id,
        },
      });
    }),
    NewArrival: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
       return  await prisma.paralaves.create({
      data:{AliveKg:"NaN",
      TransferCost:"NaN",
      recievedNetKG:"NaN",
      netKgAfterkatharisma:"NaN",

      AlivePigNumber:"NaN",
      AlivePricePerKg:"NaN",
      SlaugherCost:"NaN",
      }
      });
    }),
    DeleteArrival: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
       return  await prisma.paralaves.delete({
        where: {
          id: input.text.toString(),
        },
      });
    }),
    updateParagelia: publicProcedure
    .input(
      z.object({
        id: z.string(),
        alivePigNo: z.string(),
        alivekg: z.string(),
        pricePerKg: z.string(),
        slaugherPrice: z.string(),
        transferPrice: z.string(),
        revievedNetKG: z.string(),
        netKgAfterkatharisma: z.string(),
       
    
      })
    )
    .mutation(async ({ ctx, input }) => {
      const recordId = input.id.toString();

      try {
        const existingRecord = await prisma.paralaves.findUnique({
          where: { id: recordId },
        });
      
        if (!existingRecord) {
          // Handle the case when the record is not found
          console.log(`Record with ID ${recordId} not found.`);
          return; // Or you can perform any other desired action
        }
      
        const updatedParalaves = await prisma.paralaves.update({
          where: { id: recordId },
          data: {
            AliveKg: input.alivekg,
            TransferCost: input.transferPrice,
            recievedNetKG: input.revievedNetKG,
            netKgAfterkatharisma: input.netKgAfterkatharisma,
            AlivePigNumber: input.alivePigNo,
            AlivePricePerKg: input.pricePerKg,
            SlaugherCost: input.slaugherPrice,
          },
        });
      
        console.log(updatedParalaves);
      } catch (error) {
        // Handle the error silently
        console.error("An error occurred while updating the record:", error);
      }
      
    }),
  messageMe: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.message.create({
        data: {
          email: "" + ctx.session?.user?.email,
          body: input.text,
          userId: ctx.session?.user.id,
        },
      });
    }),
  createUserAgent: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.agents.create({
        data: {
          name: "" + input.name,
          prompt: "" + input.prompt,
          userId: ctx.session?.user.id,
        },
      });
    }),
  updateDiscoverable: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const post = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: { discoverable: input },
      });
    }),
});

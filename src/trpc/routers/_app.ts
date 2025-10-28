import { inngest } from '@/inngest/client';
import { baseProcedure, createTRPCRouter, premiunProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({

  testAi: premiunProcedure.mutation(async() => {
    await inngest.send({
      name: "execute/ai"
    })
    
    return { success: true, message: "queqed job"}
  }),

  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation( async() => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "ramanath@mail.com"
      }
    })
    
    return { success: true, message: "queqed job"}
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;
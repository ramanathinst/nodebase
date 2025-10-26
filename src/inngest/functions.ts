import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import * as Sentry from "@sentry/nextjs"
const google = createGoogleGenerativeAI({
  // custom settings
});


export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },

  async ({ event, step }) => {

    await step.sleep("predent" , "5s")

    Sentry.logger.info("User triggerd test log", { log_source: "sentry_test"})
    
    const { steps } = await step.ai.wrap("gemini-generative-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: "you are helpful assistent!",
      prompt: "who is hrithak?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    } 
  )
 
    return steps;
  },
);
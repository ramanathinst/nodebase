import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
const google = createGoogleGenerativeAI({
  // custom settings
});


export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },

  async ({ event, step }) => {

    await step.sleep("predent" , "5s")
    const { steps } = await step.ai.wrap("gemini-generative-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: "you are helpful assistent!",
      prompt: "who is modi?"
    } )

    return steps;
  },
);
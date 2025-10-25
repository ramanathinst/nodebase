import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },

  async ({ event, step }) => {

    await step.sleep("fetching-data", "10s");
    await step.sleep("transforming-videos", "10s");
    await step.sleep("sending-notification", "10s");

    await step.run("create-workflow", async() => {
        return prisma.workflow.create({
            data: {
                name: "workflow-from-inngest"
            }
        })
    })
  },
);
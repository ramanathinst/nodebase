"use client"
import { Button } from "@/components/ui/button";
 import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
 
const Page = () => {
  const tprc = useTRPC();
  const { data } = useQuery(tprc.getWorkflows.queryOptions());
  const create = useMutation(tprc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast("Job Executed!")
    }
  }));

  const testAi = useMutation(tprc.testAi.mutationOptions({
     onSuccess: () => {
      toast("Ai Job Executed!")
    }
  }));
  const queryClient = useQueryClient();

  return(
   <div className="min-w-screen min-h-screen flex justify-center items-center gap-y-6 p-6">
     Protect your server components

     <Button onClick={() => create.mutate()}>
      Create Workflow
     </Button>

     <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test Ai
     </Button>

    { JSON.stringify(data, null, 2)}

    <div>

      <LogoutButton />

    </div>

   </div>
  )
}

export default Page;
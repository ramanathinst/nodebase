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
  const queryClient = useQueryClient();

  return(
   <div className="min-w-screen min-h-screen flex justify-center items-center gap-y-6 p-6">
     Protect your server components

     <Button onClick={() => create.mutate()}>
      Create Workflow
     </Button>

    { JSON.stringify(data, null, 2)}

    <div>
    <br />
    <br />
    <br />
    <br />
      <LogoutButton />

    </div>

   </div>
  )
}

export default Page;
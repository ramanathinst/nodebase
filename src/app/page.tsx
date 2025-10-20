import { caller, getQueryClient, trpc } from "@/trpc/server";
import { hydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const Page = async() => {

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
 
  return(
   <div>
    <HydrationBoundary state={hydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <Client/>       
      </Suspense>
    </HydrationBoundary>  
   </div>
  )
}

export default Page;
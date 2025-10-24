import { requiredAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async() => {

  await requiredAuth();
  const data = await caller.getUsers();

  return(
   <div className="min-w-screen min-h-screen flex justify-center items-center gap-y-6">
     Protect your server components

     { JSON.stringify(data)}

    <div>
    <LogoutButton />

    </div>

   </div>
  )
}

export default Page;
"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
    const trpc = useTRPC();
    const test = useMutation(trpc.testAi.mutationOptions({
        onSuccess: () => {
            toast.success("success")
        },
        onError: ({message}) => {
            toast.error(message)
        }
    }));


    return (
        <div>
            <Button onClick={() => test.mutate()}>
                Test to subscription
            </Button>
        </div>
    )

}
export default Page;
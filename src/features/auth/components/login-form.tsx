"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormItem, FormField, FormMessage, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
    email: z.email("Please enter a valid email address!"),
    password: z.string().min(1, "Password is required!")
})

type loginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();

    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async(value: loginFormValues) => {
        await authClient.signIn.email({
            email: value.email,
            password: value.password,
            callbackURL: "/"
        },{
            onSuccess: () => {
                router.push("/")
                toast("you are login!")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        })
    }
    const isPending = form.formState.isSubmitting;

    return(
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Wilcome to Website!
                    </CardTitle>
                    <CardDescription>
                        Login to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    className="w-full"
                                    >
                                        <Image alt="gitHub" src={"/logos/github.svg"} height={20} width={20} />
                                        Continue with GitHub
                                    </Button>

                                    <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    className="w-full"
                                    >
                                        <Image alt="google" src={"/logos/github.svg"} height={20} width={20} />
                                        Continue with Google
                                    </Button>
                                </div>

                                <div className="grid gap-6">
                                    <FormField 
                                    name="email"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                placeholder="m@gmail.com"
                                                type="email"
                                                {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                    <FormField 
                                    name="password"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                placeholder="********"
                                                type="password"
                                                {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        Login
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Don't have an account? {" "}
                                    <Link href={"/signup"} className="underline underline-offset-4">
                                        Signup
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}



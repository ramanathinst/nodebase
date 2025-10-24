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

const signupSchema = z.object({
    email: z.email("Please enter a valid email address!"),
    password: z.string().min(1, "Password is required!"),
    confirmPassword: z.string().min(1, "Conform password is required!")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match!",
    path: ["confirmPassword"]
})

type signupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter();

    const form = useForm<signupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async(value: signupFormValues) => {
        await authClient.signUp.email({
            name: value.email,
            email: value.email,
            password: value.password,
            callbackURL: "/"
        },
        {
            onSuccess: () => {
                router.push("/")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        }
    )
    }
    const isPending = form.formState.isSubmitting;

    return(
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Get Started!
                    </CardTitle>
                    <CardDescription>
                        Create your an account to get started!
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
                                        Continue with GitHub
                                    </Button>

                                    <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                    className="w-full"
                                    >
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

                                     <FormField 
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                        Signup
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Already have an account? {" "}
                                    <Link href={"/login"} className="underline underline-offset-4">
                                        Login
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



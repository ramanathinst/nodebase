
import { LoginForm } from "@/features/auth/components/login-form";
import { requiredUnAuth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";

const Page = async() => {
    await requiredUnAuth()
    return <LoginForm /> 
}

export default Page;
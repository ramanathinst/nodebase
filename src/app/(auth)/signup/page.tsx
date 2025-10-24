import { SignupForm } from "@/features/auth/components/signup-form"
import { requiredUnAuth } from "@/lib/auth-utils"

const Page = async() => {
    await requiredUnAuth();
    return <SignupForm /> 
}

export default Page;
import { requiredAuth } from "@/lib/auth-utils";

const Page = async() => {
    await requiredAuth();
    return <div>
        Workflows page in ramanath
    </div>
}

export default Page;
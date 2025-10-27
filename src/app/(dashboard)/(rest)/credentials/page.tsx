import { requiredAuth } from "@/lib/auth-utils";

const Page = async() => {
    await requiredAuth();
    return <div>
        credentials Page
    </div>
}

export default Page;
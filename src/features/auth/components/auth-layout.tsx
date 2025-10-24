import Image from "next/image"
import Link from "next/link"

export const AuthLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <>
        <div className="bg-muted items-center flex flex-col justify-center min-h-svh gap-6 p-6 md:p-10">
            <div className="flex flex-col w-full max-w-sm gap-6">
                <Link href={"/"} className="flex items-center gap-2 font-medium self-center">
                    <Image src={"/logos/logo.svg"} width={30} height={30} alt="nodebase"/>
                    Nodebase
                </Link>
              {children}
            </div>
        </div>
        </>
    )
}
import { SidebarTrigger } from "@/components/ui/sidebar"
export const AppHeader = () => {
    return(
        <header className="flex h-10 px-4 gap-4 items-center border-b bg-background shrink-0">
            <SidebarTrigger />
        </header>
    )
}
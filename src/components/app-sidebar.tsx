"use client"

import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter} from "next/navigation"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

const menuItems = [
    {
        title: "main",
        items: [
            {
              title: "Workflows",
              icon:   FolderOpenIcon,
              url: "/workflows"
            },
             {
              title: "Credentials",
              icon:   KeyIcon,
              url: "/credentials"
            },
             {
              title: "Executtions",
              icon:   HistoryIcon,
              url: "/executions"
            }
        ]
    }
]

export const AppSiderbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 px-4 h-10">
                        <Link href={"/"} prefetch>
                            <Image alt="Nodebase" src={"/logos/logo.svg"} height={30} width={30} />
                            <span className="font-semibold text-sm">
                                Nodebase
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                { menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    { group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                asChild
                                                isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                                                className="gap-x-5 h-10 px-5"
                                            >
                                                <Link href={item.url} prefetch>
                                                    <item.icon className="size-6" />  
                                                    <span>{item.title}</span>
                                                </Link>

                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>

                            </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upgrade to Pro" className="gap-x-4 h-10 px-4" onClick={() => {}}>
                            <StarIcon />
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Billing Portal" className="gap-x-4 h-10 px-4" onClick={() => {}}>
                            <CreditCardIcon />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="sign out" className="gap-x-4 h-10 px-4" onClick={() => authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/login")
                                    toast("Sign out")
                                }
                            }
                        })}>
                            <LogOutIcon />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
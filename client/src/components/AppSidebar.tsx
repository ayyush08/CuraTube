
import { Home, Library, LucideLayoutDashboard, Play, Settings, ThumbsUpIcon, User } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APP_NAME } from "@/lib/constants"
import { useLocation } from "@tanstack/react-router"


const navigationData = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "My Playlists",
        url: "/playlists",
        icon: Library,
    },
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LucideLayoutDashboard,
    },
    {
        title: "Liked Videos",
        url: "/liked-videos",
        icon: ThumbsUpIcon,
    },
]

export function AppSidebar() {

    const location = useLocation()

    return (
        <Sidebar variant="sidebar" collapsible="icon" >
            <SidebarHeader >
                <SidebarMenu >
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:bg-sidebar-accent-foreground-" size="lg" asChild>
                            <div>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 text-white">
                                    <Play className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{APP_NAME}</span>
                                    <span className="truncate text-xs text-muted-foreground">Your Entertainment Hub</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.map((item) => {
                                const isActive = location.pathname === item.url
                                return <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton  className={`${isActive ? "bg-sidebar-accent" : ''}  `} asChild>
                                        <a href={item.url}  >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>



            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                        <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">John Doe</span>
                                        <span className="truncate text-xs text-muted-foreground">Premium Member</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar >
    )
}

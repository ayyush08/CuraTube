
import { HistoryIcon, Home, Library, LucideLayoutDashboard, Play, TestTube, ThumbsUpIcon } from "lucide-react"

import {
    Sidebar,
    SidebarContent,

    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"


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
    {
        title: "Watch History",
        url: "/watch-history",
        icon: HistoryIcon,
    },
    {
        title: "component testing route",
        url: '/test-component',
        icon: TestTube
    }
]

export function AppSidebar() {

    const location = useLocation()

    return (
        <Sidebar variant="inset" collapsible="icon" >
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
                                    <SidebarMenuButton  className={`${isActive ? "bg-sidebar-accent" : ''} p-5 text-lg font-semibold `} asChild>
                                        <a href={item.url}  >
                                            <item.icon className="text-lg font-semibold"/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>



            </SidebarContent>

            

        </Sidebar >
    )
}

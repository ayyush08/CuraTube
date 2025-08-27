
import { HistoryIcon, Home, Library, LucideLayoutDashboard, Pen, ThumbsUpIcon } from "lucide-react"

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
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useAppSelector } from "@/redux/hooks"

import { toast } from "sonner"
import { Logo } from "./Logo"


const navigationData = [
    {
        title: "Home",
        url: "/",
        icon: Home,
        checkAuth: false
    },
    {
        title: "My Playlists",
        url: "/playlists",
        icon: Library,
        checkAuth: true
    },
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LucideLayoutDashboard,
        checkAuth: true
    },
    {
        title: "Liked Videos",
        url: "/liked-videos",
        icon: ThumbsUpIcon,
        checkAuth: true
    },
    {
        title: "Watch History",
        url: "/watch-history",
        icon: HistoryIcon,
        checkAuth: true
    },
    {
        title: "Tweets",
        url: '/tweets',
        icon: Pen,
        checkAuth: false
    },

]

export function AppSidebar() {

    const location = useLocation()
    const navigate = useNavigate()
    const storedUser = useAppSelector((state) => state.auth.user);

    const handleTabClick = (url: string,checkAuth:boolean) => {
        if (checkAuth && !storedUser) {
            toast.error("You must be logged in to access this page.");
            return;
        }
        navigate({
            to: url,
        })

    }

    return (
        <Sidebar variant="inset" collapsible="icon" >
            <SidebarHeader >
                <SidebarMenu >
                    <SidebarMenuItem>
                        <SidebarMenuButton className="bg-transparent hover:bg-transparent active:bg-transparent" size="lg" asChild>
                            <div className="space-x-4">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-white">
                                    
                                    <Logo/>
                                </div>
                                <div className="grid flex-1 text-left text-lg leading-tight">
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
                                    <SidebarMenuButton variant={"default"} className={`${isActive ? " border-2 border-orange-500 bg-orange-600/20 text-white hover:bg-orange-500 hover:text-neutral-100 transition-colors duration-300" : ''} p-5 text-lg font-semibold `} asChild>
                                        <p className="cursor-pointer" onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick(item.url,item.checkAuth);
                                        }}>
                                            <item.icon className="text-lg font-semibold" />
                                            <span>{item.title}</span>
                                        </p>
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

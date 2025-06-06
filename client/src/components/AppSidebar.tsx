
import { BookmarkIcon, Clock, Home, Library, Play, Search, Settings, TrendingUp, Tv, User, Video, } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
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

// Navigation data for the streaming app
const navigationData = {
    main: [
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
            title: "Trending",
            url: "/trending",
            icon: TrendingUp,
        },
        {
            title: "Live TV",
            url: "/live",
            icon: Tv,
        },
    ],
    library: [
        {
            title: "My Library",
            url: "/library",
            icon: Library,
        },
        {
            title: "Watchlist",
            url: "/watchlist",
            icon: BookmarkIcon,
        },
        {
            title: "Recently Watched",
            url: "/recent",
            icon: Clock,
        },
        {
            title: "Continue Watching",
            url: "/continue",
            icon: Play,
        },
    ],
    genres: [
        {
            title: "Movies",
            url: "/movies",
            icon: Video,
        },
        {
            title: "TV Shows",
            url: "/tv-shows",
            icon: Tv,
        },
        {
            title: "Documentaries",
            url: "/documentaries",
            icon: Video,
        },
        {
            title: "Kids",
            url: "/kids",
            icon: Video,
        },
    ],
}

export function AppSidebar() {
    return (
        <Sidebar  variant="floating">
            <SidebarHeader >
                <SidebarMenu >
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                                    <Play className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{APP_NAME}</span>
                                    <span className="truncate text-xs text-muted-foreground">Your Entertainment Hub</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <form>
                    <SidebarGroup className="py-0">
                        <SidebarGroupContent className="relative">
                            <SidebarInput id="search" placeholder="Search movies, shows..." className="pl-8" />
                            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </form>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.main.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>My Library</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.library.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Browse by Category</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.genres.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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
            <SidebarRail />
        </Sidebar>
    )
}


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSelector } from "@/redux/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon, User } from "lucide-react";

interface DropdownMenuItem {
    name: string;
    onClick: () => void;
    icon: React.ReactNode;
}

export function ProfileDropdown({
    user,
    setActiveDialog
}: {
    user: any,
    setActiveDialog: (dialog: string | null) => void;
}) {

    const navigate = useNavigate()
    const username = useAppSelector(state => state.auth.user?.username)
    const dropdownMenuItems: DropdownMenuItem[] = [
        {
            name: "My Profile",
            onClick: () => navigate({
                to: `/channel/${username}`
            }),
            icon: <User className="text-white" />
        },
        {
            name: "Logout",
            onClick: () => setActiveDialog("logout"),
            icon: <LogOutIcon className="text-white" />
        },
    ];
    return (
        <DropdownMenu  >
            <DropdownMenuTrigger asChild >

                <Avatar className="w-14 h-14 cursor-pointer border-2 border-orange-400/60 overflow-hidden rounded-full">
                    <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                        className="w-full h-full object-cover rounded-full"
                    />
                    <AvatarFallback className="text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>


            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-orange-950/80" align="start"  >
                <DropdownMenuGroup>
                    {
                        dropdownMenuItems.map((item, index) => (
                            <DropdownMenuItem className="hover:bg-orange-700" key={index} onClick={item.onClick}>
                                {item.icon}
                                {item.name}

                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>


            </DropdownMenuContent>
        </DropdownMenu>
    )
}

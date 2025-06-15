
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface DropdownMenuItem {
    name: string;
    onClick: () => void;

}

export function ProfileDropdown({
    user,
    setActiveDialog
}: {
    user: any,
    setActiveDialog: (dialog: string | null) => void;
}) {
    const dropdownMenuItems: DropdownMenuItem[] = [
        {
            name: "My Profile",
            onClick: () => console.log("Profile clicked"),
        },
        {
            name: "Logout",
            onClick: () => setActiveDialog("logout"),
        },
    ];
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>

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
            <DropdownMenuContent className="w-56 bg-orange-950/80" align="start" >
                <DropdownMenuGroup>
                    {
                        dropdownMenuItems.map((item, index) => (
                            <DropdownMenuItem className="hover:bg-orange-700" key={index} onClick={item.onClick}>
                                {item.name}
                                
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>


            </DropdownMenuContent>
        </DropdownMenu>
    )
}

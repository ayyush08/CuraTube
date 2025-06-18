import { useState } from "react"
import { LoginDialog } from "./auth/LoginDialog"
import { SignUpDialog } from "./auth/SignUpDialog"
import { Input } from "./ui/input"
import { SidebarTrigger } from "./ui/sidebar"
import { SearchIcon, Upload } from "lucide-react"
import { Button } from "./ui/button"
import LogoutDialog from "./auth/LogoutDialog"
import { useAppSelector } from "@/redux/hooks"
import { ProfileDropdown } from "./auth/ProfileDropdown"
import { useIsMobile } from "@/hooks/helpers/use-mobile"
import { useNavigate } from "@tanstack/react-router"

const Header = () => {
    const [activeDialog, setActiveDialog] = useState<string | null>(null)
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);
    console.log("isAuthenticated:", isAuthenticated)
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const onSearchClick = () => {
        console.log('search clicked');

    }

    return (
        <div className="w-full h-20 px-6 sticky top-0 flex items-center justify-between font-sans z-10  backdrop-blur-md ">
            <div className=" flex justify-start items-center w-full" >
                {isMobile && <SidebarTrigger className="cursor-pointer" />}
                <SearchBar onIconClick={onSearchClick} />
            </div>

            {
                isAuthenticated ? (
                    <div className="flex items-center  gap-3">
                        <Button
                            variant='secondary'
                            onClick={() => navigate({to:'/videos/publish'})}
                            className="p-5 text-base bg-gradient-to-r from-orange-600/50 to-amber-600/40 hover:bg-gradient-to-r hover:from-orange-700 hover:to-amber-700 transition-colors duration-500 text-white cursor-pointer"
                        >
                            <Upload/> Upload Video
                        </Button>
                        <ProfileDropdown user={user} setActiveDialog={setActiveDialog} />

                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setActiveDialog("login")}
                            className="sm:p-5 sm:text-base border-2 border-orange-400/60 hover:bg-orange-700/20 bg-orange-900/10 text-white cursor-pointer"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => setActiveDialog("signup")}
                            className="sm:p-5 sm:text-base border-2 border-orange-400/60 bg-orange-900/10 hover:bg-orange-700/20 text-white cursor-pointer"
                        >
                            Signup
                        </Button>

                    </div>
                )
            }
            <LoginDialog
                open={activeDialog === "login"}
                onClose={() => setActiveDialog(null)}
                onSwitchToSignup={() => setActiveDialog("signup")}
            />
            <SignUpDialog
                open={activeDialog === "signup"}
                onClose={() => setActiveDialog(null)}
                onSwitchToLogin={() => setActiveDialog("login")}
            />
            <LogoutDialog
                open={activeDialog === "logout"}
                onClose={() => setActiveDialog(null)}
            />
        </div>
    )
}

export default Header




interface InputWithIconProps extends React.ComponentProps<"input"> {
    onIconClick?: () => void
}

function SearchBar({ type = "text", onIconClick }: InputWithIconProps) {
    const [searchValue, setSearchValue] = useState('')
    console.log(searchValue);

    return (
        <div className="relative w-fit  max-w-xl sm:max-w-2xl sm:w-full xs:max-w-full px-4 py-2 z-10">
            <Input
                type={type}
                placeholder="Search Videos here..."
                className="rounded-3xl pr-10 text-sm sm:text-base"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <SearchIcon

                className="absolute right-7 top-1/2 -translate-y-1/2 h-5 w-6 text-white cursor-pointer"
                onClick={onIconClick}
            />
        </div>
    )
}

export { Input }

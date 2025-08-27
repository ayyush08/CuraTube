import { useEffect, useState } from "react"
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
import { useLocation, useNavigate } from "@tanstack/react-router"
import { ChangePasswordDialog } from "./auth/ChangePasswordDialog"

const Header = () => {
    const [activeDialog, setActiveDialog] = useState<string | null>(null)
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);
    console.log("isAuthenticated:", isAuthenticated)
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const location = useLocation()




    const onSearchSubmit = (value: string) => {
        console.log('search clicked', value);
        if (value.trim() === "") {
            window.history.back(); // If the search input is empty, go back to the previous page
            return;
        }
        navigate({ to: `/videos/search-videos/${value.trim()}` });

    }

    return (
        <div className="w-full h-20 px-6 sticky top-0 flex items-center justify-between font-sans z-10  backdrop-blur-md ">
            <div className=" flex justify-start items-center w-full" >
                {isMobile && <SidebarTrigger className="cursor-pointer" />}
                <SearchBar onSubmit={onSearchSubmit} />

            </div>

            {
                isAuthenticated ? (
                    <div className="flex items-center  gap-3">
                        {
                            location.pathname !== '/videos/publish' && (
                                <Button
                                    variant='secondary'
                                    onClick={() => navigate({ to: '/videos/publish' })}
                                    className="sm:p-5 sm:text-base rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-black/80 hover:text-white"
                                >
                                    <Upload /> Upload Video
                                </Button>
                            )
                        }
                        <ProfileDropdown user={user} setActiveDialog={setActiveDialog} />

                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setActiveDialog("login")}
                            className="sm:p-5 sm:text-base rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-black/80 hover:text-white"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => setActiveDialog("signup")}
                            className="sm:p-5 sm:text-base rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-black/80 hover:text-white"
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
            <ChangePasswordDialog
                open={activeDialog === "change-password"}
                onClose={() => setActiveDialog(null)}
            />
            <LogoutDialog
                open={activeDialog === "logout"}
                onClose={() => setActiveDialog(null)}
            />
        </div>
    )
}

export default Header




interface InputWithIconProps {
    onSubmit: (value: string) => void;
}

function SearchBar({ onSubmit }: InputWithIconProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(value.trim());
    };
    useEffect(() => {
        if (value.trim() === "") {
            // This ensures we go back only if we are on a search route
            if (window.location.pathname.startsWith("/videos/search-videos")) {
                window.history.back();
            }
        }
    }, [value]);
    return (
        <div className="relative w-fit max-w-xl sm:max-w-2xl sm:w-full xs:max-w-full px-4 py-2 z-10">
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Search Videos here..."
                    className="rounded-3xl pr-10 text-sm sm:text-base"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <SearchIcon
                    className="absolute right-7 top-1/2 -translate-y-1/2 h-5 w-6 text-white cursor-pointer"
                    type="submit"
                    onClick={() => onSubmit(value.trim())}
                />
            </form>
        </div>
    );
}





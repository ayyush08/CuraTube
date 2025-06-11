import { useState } from "react"
import { LoginDialog } from "./LoginDialog"
import { SignUpDialog } from "./SignUpDialog"
import { Input } from "./ui/input"
import { SidebarTrigger } from "./ui/sidebar"
import {  SearchIcon } from "lucide-react"

const Header = () => {



    const onSearchClick = () => {
        console.log('search clicked');

    }

    return (
        <div className="w-full h-20 px-6 sticky top-0 flex items-center justify-between font-sans ">
            <div className=" flex justify-start items-center w-full gap-16" >
                <SidebarTrigger className=" p-0 sm:p-0 scale-110 cursor-pointer" />
                <SearchBar onIconClick={onSearchClick} />
            </div>

            {/* //TODO: make these dialog buttons responsive and add api calls for auth inside each */}
            <div className="flex items-center gap-3">
                <LoginDialog />
                <SignUpDialog />
            </div>
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
        <div className="relative w-full  max-w-xl sm:max-w-2xl xs:max-w-full px-4 py-2">
            <Input
                type={type}
                placeholder="Search Videos here..."
                className="rounded-3xl pr-10 text-sm sm:text-base"
                value={searchValue}
                onChange={(e)=>setSearchValue(e.target.value)}
            />
            <SearchIcon
            
                className="absolute right-7 top-1/2 -translate-y-1/2 h-5 w-6 text-white cursor-pointer"
                onClick={onIconClick}
            />
        </div>
    )
}

export { Input }

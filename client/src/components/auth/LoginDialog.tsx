
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/auth.hooks"

import { useEffect, useState } from "react"


export function LoginDialog({
    open,
    onClose,
    onSwitchToSignup,
}: {

    open: boolean
    onClose: () => void
    onSwitchToSignup: () => void
}) {
    const [identifier, setIdentifier] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const {
        mutate: loginUser,
        isPending,
        isError
    } = useLogin(onClose)

    if (isError) console.log(isError);
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submitted")
        const isEmail = identifier.includes("@")

        const loginData = isEmail
            ? { email: identifier, password }
            : { username: identifier, password }

        loginUser(loginData)
    }


    useEffect(()=>{
        if(!open){
            setIdentifier("")
            setPassword("")
        }
    },[open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="p-5 text-base bg-orange-600 hover:bg-orange-800 text-white cursor-pointer">
                    Login
                </Button>
            </DialogTrigger> */}

            <DialogContent showCloseButton={false} onInteractOutside={e=>e.preventDefault()} className="sm:max-w-[425px] h-84 bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xl">
                <form onSubmit={handleLogin} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-sans tracking-wide">Login</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <Label htmlFor="identifier">Email or Username</Label>
                        <Input
                            id="identifier"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            name="identifier"
                            placeholder="Your email/username here..."
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            placeholder="Your password here..."
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={onClose}  type="button" className="cursor-pointer rounded-lg border border-red-500/60 bg-black/60 px-5 py-2 text-red-400 hover:border-red-400 hover:bg-red-500 hover:text-white"
                            disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button className="cursor-pointer rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-orange-500 hover:text-white" type="submit">
                            {isPending ? "Logging In.." : "Login"}
                        </Button>
                    </DialogFooter>
                </form>
                <div className="text-center text-base text-gray-400 mt-2">
                    Don't have an account?
                    <Button variant='link' className="cursor-pointer hover:text-orange-500 font-bold" onClick={() => {
                        onClose();
                        onSwitchToSignup();
                    }}>
                        Sign up
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

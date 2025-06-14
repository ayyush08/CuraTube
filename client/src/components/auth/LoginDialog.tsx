import { login } from "@/api/auth.api"
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
import { loginSuccess } from "@/redux/authSlice"
import { useAppDispatch } from "@/redux/hooks"
import { useState } from "react"

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
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submitted")

        try {
            setIsLoggingIn(true)

            const isEmail = identifier.includes("@")

            const loginData = isEmail
                ? { email: identifier, password }
                : { username: identifier, password }

            const res = await login(loginData)

            if (res) {
                console.log(res)
                dispatch(loginSuccess({
                    ...res.user
                }))
            }
            onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="p-5 text-base bg-orange-600 hover:bg-orange-800 text-white cursor-pointer">
                    Login
                </Button>
            </DialogTrigger> */}

            <DialogContent showCloseButton={false} className="sm:max-w-[425px] h-84 border-orange-400/60 bg-orange-900/10">
                <form onSubmit={handleLogin} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-sans tracking-wide">Login</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <Label htmlFor="identifier">Email or Username</Label>
                        <Input
                            id="identifier"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            placeholder="Your password here..."
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={onClose} variant="outline" type="button" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button className="cursor-pointer" type="submit">
                            {isLoggingIn ? "Logging In.." : "Login"}
                        </Button>
                    </DialogFooter>
                </form>
                <div className="text-center text-sm text-gray-500 mt-2">
                    Don't have an account?
                    <Button variant='link' className="cursor-pointer hover:text-blue-500" onClick={() => {
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

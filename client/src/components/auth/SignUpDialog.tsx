
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
import { useEffect, useState } from "react"
import ProfileImageUpload from "./ProfileImageUpload"
import { useRegisterLogin } from "@/hooks/auth.hooks"

export function SignUpDialog({
    open,
    onClose,
    onSwitchToLogin
}: {

    open: boolean
    onClose: () => void
    onSwitchToLogin: () => void
}) {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        avatar: null as File | null,
        coverImage: null as File | null,
    })

    const {
        mutate: createAccount,
        isPending,
        isError,
    } = useRegisterLogin(onClose)


    if (isError) console.log(isError);


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.coverImage) {
            alert("Please add a cover image")
            return
        }
        if (!formData.avatar) {
            alert("Please add profile image")
            return
        }
        createAccount({ ...formData })
        

    }

    useEffect(() => {
        if (!open) {
            setFormData({
                fullName: "",
                username: "",
                email: "",
                password: "",
                avatar: null,
                coverImage: null,
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px] max-h-screen bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xl">

                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-sans tracking-wide">SignUp</DialogTitle>
                </DialogHeader>
                <ProfileImageUpload formData={formData} setFormData={setFormData} className="mb-4" />
                <form onSubmit={handleRegister} className="grid gap-4">


                    <div className="grid gap-3">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            name="fullName"
                            placeholder="Your full name here..."
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            name="username"
                            placeholder="Your username here..."
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            name="email"
                            placeholder="Your email here..."
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            id="password"
                            name="password"
                            placeholder="Your password here..."
                            required
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild >
                            <Button disabled={isPending} onClick={onClose}  type="button" className="cursor-pointer rounded-lg border border-red-500/60 bg-black/60 px-5 py-2 text-red-400 hover:border-red-400 hover:bg-red-500 hover:text-white">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-orange-500 hover:text-white"
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>


                    </DialogFooter>
                </form>
                <div className="text-center text-base font-semibold text-gray-400 mt-2">
                    Already have an account?
                    <Button variant='link' className="cursor-pointer hover:text-orange-500 font-bold" onClick={() => {
                        onClose();
                        onSwitchToLogin();
                    }}>
                        Log in
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

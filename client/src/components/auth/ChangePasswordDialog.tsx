
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
import { useChangePassword } from "@/hooks/auth.hooks"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { useEffect, useState } from "react"
import { toast } from "sonner"


export function ChangePasswordDialog({
    open,
    onClose,
}: {

    open: boolean
    onClose: () => void
}) {
    const [oldPassword, setOldPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [isShowOldPassword, setIsShowOldPassword] = useState<boolean>(false)
    const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false)

    const {
        mutate: changePassword,
        isPending,
        isError
    } = useChangePassword(onClose)

    if (isError) console.log(isError);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(oldPassword===newPassword){
            toast.error("New password must be different from old password");
            return;
        }
        changePassword({
            oldPassword,
            newPassword
        })
    }



    useEffect(() => {
        if (!open) {
            setOldPassword("");
            setNewPassword("");
            setIsShowOldPassword(false);
            setIsShowNewPassword(false);
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="p-5 text-base bg-orange-600 hover:bg-orange-800 text-white cursor-pointer">
                    Login
                </Button>
            </DialogTrigger> */}

            <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px] bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xl">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-sans tracking-wide">Change Password</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3 relative">
                        <Label htmlFor="old-password">Old Password</Label>
                        <Input
                            id="old-password"
                            type={isShowOldPassword ? "text" : "password"}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            name="old-password"
                            placeholder="Your old password here..."
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setIsShowOldPassword((prev) => !prev)}
                            className="absolute right-3 top-[68%] -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                            {isShowOldPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="grid gap-3 relative">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input

                            type={isShowNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            id="new-password"
                            name="new-password"
                            placeholder="Your new password here..."
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setIsShowNewPassword((prev) => !prev)}
                            className="absolute right-3 top-[68%] -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                            {isShowNewPassword ? (
                                <EyeOffIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
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
                            {isPending ? "Changing Password.." : "Change Password"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

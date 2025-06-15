
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
import {  useState } from "react"
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


    if(isError) console.log(isError);
    

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
            createAccount({...formData})
        // try {
        //     setIsRegistering(true)
            

            // console.log("Submitting FormData:", formData)
            // const res = await register({ ...formData })
            // if(res){
            //     const loginUser = await login({
            //         username: formData.username,
            //         password: formData.password
            //     })
            //     if(loginUser){
            //         toast.success(`Welcome to CuraTube, ${loginUser.user.username}`)
            //         dispatch(loginSuccess({...loginUser.user}))
            //     }
                
            // }
            
            // onClose()
        // } catch (error) {
        //     console.error(error)
        // } finally {
        //     setIsRegistering(false)
        // }

    }

    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[425px] max-h-screen border-orange-400/60 bg-orange-900/10">

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
                            <Button disabled={isPending} onClick={onClose} variant="outline" type="button" className="cursor-pointer">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button className="cursor-pointer" type="submit">
                            {isPending ? "Creating Account... " : "Create Account"}
                        </Button>
                    </DialogFooter>
                </form>
                <div className="text-center text-sm text-gray-500 mt-2">
                    Already have an account?
                <Button variant='link' className="cursor-pointer hover:text-blue-500" onClick={() => {
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

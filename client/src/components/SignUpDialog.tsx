import {  register } from "@/api/auth.api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import ProfileImageUpload from "./ProfileImageUpload"

export function SignUpDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        avatar: null as File | null,
        coverImage: null as File | null,
    })


    useEffect(()=>{

    },[])

    const [isRegistering, setIsRegistering] = useState<boolean>(false)

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsRegistering(true)
            if(!formData.coverImage) {alert("Please add a cover image")
                return
            }
            if(!formData.avatar) {alert("Please add profile image")
                return
            }

            console.log("Submitting FormData:", formData)
            const res = await register({...formData})
            console.log(res)
            setIsDialogOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsRegistering(false)
        }
    
}

return (
    <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
            <Button onClick={()=>setIsDialogOpen(true)} className="p-5 text-base bg-orange-600 hover:bg-orange-800 text-white cursor-pointer">
                SignUp
            </Button>
        </DialogTrigger>

        <DialogContent showCloseButton={false}  onInteractOutside={(e)=>e.preventDefault()} className="sm:max-w-[425px] max-h-screen border-orange-400/60 bg-orange-900/10">

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
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild >
                        <Button onClick={()=>setIsDialogOpen(false)} variant="outline" type="button" className="cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="cursor-pointer" type="submit">
                        {isRegistering ? "Creating Account... " : "Create Account"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
)
}

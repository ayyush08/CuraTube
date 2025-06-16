
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

import { useLogout } from '@/hooks/auth.hooks';

const LogoutDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {

    const { mutate: logoutUser ,isPending} = useLogout(onClose)
    const handleLogout = async () => {
        console.log('logout clicked');
        logoutUser()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-950/75 font-sans">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to logout?</DialogTitle>
                    <DialogDescription>
                        This action will log you out of your account.
                        <br />
                        You will need to log in again to access your profile and features.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer' disabled={isPending} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className='bg-red-500 hover:bg-red-700 cursor-pointer text-white' onClick={() => handleLogout()} >{
                        isPending ? "Logging out..." : "Logout"
                        }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default LogoutDialog
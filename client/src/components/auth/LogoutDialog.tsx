
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

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xl font-sans">
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
                        <Button className='cursor-pointer rounded-lg border border-red-500/60 bg-black/60 px-5 py-2 text-red-400 hover:border-red-400 hover:bg-red-500 hover:text-white' disabled={isPending}>Cancel</Button>
                    </DialogClose>
                    <Button className='rounded-lg border border-orange-500/60 bg-black/60 px-5 py-2 text-orange-400 hover:border-orange-400 hover:bg-orange-500 hover:text-white cursor-pointer' onClick={() => handleLogout()} >{
                        isPending ? "Logging out..." : "Logout"
                        }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default LogoutDialog
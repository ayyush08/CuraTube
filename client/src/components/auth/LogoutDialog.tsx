

import { logout as LogUserOut } from '@/api/auth.api';
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import { logout } from '@/redux/authSlice';
import { persistor } from '@/redux/store';

const LogoutDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {

    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        console.log('logout clicked');
        try {
            setIsLoggingOut(true)
            const res = await LogUserOut()
            if (res) {
                console.log("Logout successful:", res);
                dispatch(logout())
                persistor.purge()
            }
            onClose()
        } catch (error) {
            console.log(error);
            
        }finally{
            setIsLoggingOut(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-900/10 font-sans">
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
                        <Button className='cursor-pointer' variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className='bg-red-500 hover:bg-red-700 cursor-pointer text-white' onClick={() => handleLogout()} >{
                        isLoggingOut ? "Logging out..." : "Logout"
                        }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default LogoutDialog
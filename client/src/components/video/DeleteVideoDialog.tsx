
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeleteVideo } from "@/hooks/video.hook";

export const DeleteVideoDialog = ({ open, videoId, onClose }: { open: boolean, videoId: string, onClose: () => void }) => {

    const { mutate: deleteVideo, isPending: deletePending } = useDeleteVideo(onClose);

    const handleDelete = () => {
        console.log('Deleting video with ID:', videoId);
        deleteVideo(videoId);
        
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xl font-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to delete this video?</DialogTitle>
                    <DialogDescription>
                        Once deleted, this video will be permanently removed and cannot be recovered on this platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer rounded-lg border border-green-500/60 bg-black/60 px-5 py-2 text-green-400 hover:border-green-400 hover:bg-green-500/20 hover:text-white' disabled={deletePending}>Cancel</Button>
                    </DialogClose>
                    <Button disabled={deletePending} className='cursor-pointer rounded-lg border border-red-500/60 bg-black/60 px-5 py-2 text-red-400 hover:border-red-400 hover:bg-red-500/20 hover:text-white' onClick={handleDelete} >{
                        deletePending ? "Deleting..." : "Delete"
                    }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
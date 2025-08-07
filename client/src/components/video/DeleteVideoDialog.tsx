
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeleteVideo } from "@/hooks/video.hook";

export const DeleteVideoDialog = ({ open, videoId, onClose }: { open: boolean, videoId: string, onClose: () => void }) => {

    const { mutate: deleteVideo, isPending: deletePending } = useDeleteVideo();

    const handleDelete = () => {
        console.log('Deleting video with ID:', videoId);
        deleteVideo(videoId);
        window.history.back(); // Navigate back after deletion
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-800/20 font-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to delete this video?</DialogTitle>
                    <DialogDescription>
                        Once deleted, this video will be permanently removed and cannot be recovered on this platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer' disabled={deletePending} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={deletePending} className='bg-red-500 hover:bg-red-700 cursor-pointer text-white' onClick={handleDelete} >{
                        deletePending ? "Deleting..." : "Delete"
                    }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
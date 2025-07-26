
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {  useRemoveVideoFromPlaylist } from "@/hooks/playlist.hook";


export const DeleteVideoFromPlaylistDialog = ({ open, playlistId, videoId, onClose }: { open: boolean, playlistId: string, videoId: string, onClose: () => void }) => {

    const { mutate: deleteVideoFromPlaylist, isPending: deletePending } = useRemoveVideoFromPlaylist();
    const handleDelete = () => {
        console.log('Deleting video with ID:', videoId);
        deleteVideoFromPlaylist({ playlistId, videoId });
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-950/80 font-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to remove this video from the playlist?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. You will have to add the video back again if you want it in the playlist.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer' disabled={deletePending} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className='bg-red-500 hover:bg-red-700 cursor-pointer text-white' onClick={handleDelete} >{
                        deletePending ? "Deleting..." : "Delete"
                    }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
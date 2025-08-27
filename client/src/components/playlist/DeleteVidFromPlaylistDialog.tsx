
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {  useRemoveVideoFromPlaylist } from "@/hooks/playlist.hook";


export const DeleteVideoFromPlaylistDialog = ({ open, playlistId, videoId, onClose }: { open: boolean, playlistId: string, videoId: string, onClose: () => void }) => {

    const { mutate: deleteVideoFromPlaylist, isPending: deletePending } = useRemoveVideoFromPlaylist(onClose);
    const handleDelete = () => {
        console.log('Deleting video with ID:', videoId);
        deleteVideoFromPlaylist({ playlistId, videoId });
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   bg-gradient-to-b from-orange-900 to-black/90 border border-orange-500/40 shadow-lg shadow-black/70 rounded-2xlfont-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to remove this video from the playlist?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. You will have to add the video back again if you want it in the playlist.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer rounded-lg border border-green-500/60 bg-black/60 px-5 py-2 text-green-400 hover:border-green-400 hover:bg-green-500/20 hover:text-white' disabled={deletePending}>Cancel</Button>
                    </DialogClose>
                    <Button className='cursor-pointer rounded-lg border border-red-500/60 bg-black/60 px-5 py-2 text-red-400 hover:border-red-400 hover:bg-red-500/20 hover:text-white' onClick={handleDelete} >{
                        deletePending ? "Deleting..." : "Delete"
                    }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
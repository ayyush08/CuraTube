
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeletePlaylist } from "@/hooks/playlist.hook";

export const DeletePlaylistDialog = ({ open, playlistId, onClose }: { open: boolean, playlistId: string, onClose: () => void }) => {

    const { mutate: deletePlaylist, isPending: deletePending } = useDeletePlaylist(onClose);
    const handleDelete = () => {
        console.log('Deleting playlist with ID:', playlistId);
        deletePlaylist(playlistId);
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-950/80 font-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to delete this playlist?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
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
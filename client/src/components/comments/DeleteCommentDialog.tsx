
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeleteComment } from "@/hooks/comments.hook";

export const DeleteCommentDialog = ({ open, commentId, onClose, videoId }: { open: boolean, commentId: string, onClose: () => void, videoId: string }) => {

    const { mutate: deleteComment, isPending: deletePending } = useDeleteComment(videoId,onClose);

    const handleDelete = () => {
        console.log('Deleting comment with ID:', commentId);
        deleteComment(commentId);
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-950/70 font-sans z-50">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to delete this comment?</DialogTitle>
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